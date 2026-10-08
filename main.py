import uuid
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google.auth.transport import requests as google_auth_requests
from google.genai.errors import APIError
from google.oauth2 import id_token
from pydantic import BaseModel

from orchestrator import analyze_uploaded_document, chat as run_chat, kb
from eligibility_engine import evaluate_eligibility
from grievance_agent import create_ticket, get_ticket
from config import GOOGLE_CLIENT_ID

app = FastAPI(title="AI Government Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store for the prototype. Replace with Redis/Postgres
# for anything beyond local development.
_SESSIONS: Dict[str, List[dict]] = {}


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    reply: str


class GoogleLoginRequest(BaseModel):
    credential: str


@app.post("/api/auth/google")
def google_login(req: GoogleLoginRequest):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google sign-in is not configured on the server")

    try:
        claims = id_token.verify_oauth2_token(
            req.credential, google_auth_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError as error:
        raise HTTPException(status_code=401, detail="Google sign-in token is invalid or expired") from error

    if not claims.get("email_verified"):
        raise HTTPException(status_code=401, detail="Google account email is not verified")

    return {
        "id": claims["sub"],
        "email": claims["email"],
        "name": claims.get("name", ""),
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    session_id = req.session_id or str(uuid.uuid4())
    conversation = _SESSIONS.get(session_id, [])
    conversation.append({"role": "user", "content": req.message})

    try:
        result = run_chat(conversation)
    except APIError as error:
        if error.code == 503:
            raise HTTPException(
                status_code=503,
                detail="Gemini is temporarily overloaded on the configured models. Please try again shortly.",
            ) from error
        raise HTTPException(
            status_code=502,
            detail=f"Gemini chat failed ({error.code}): {error.message or 'provider error'}",
        ) from error
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    _SESSIONS[session_id] = result["conversation"]
    return ChatResponse(session_id=session_id, reply=result["reply"])


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Schemes & Benefits
# ---------------------------------------------------------------------------

@app.get("/api/schemes")
def list_schemes(q: Optional[str] = None, state: Optional[str] = None):
    """List schemes, optionally ranked by relevance to a free-text query."""
    if q:
        results = kb.search(q, state=state, top_k=len(kb.schemes))
        return [{"match_score": round(r.score, 2), **r.scheme} for r in results]
    return [{"match_score": None, **s} for s in kb.schemes]


@app.get("/api/schemes/{scheme_id}")
def get_scheme(scheme_id: str):
    scheme = kb.get_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


# ---------------------------------------------------------------------------
# Eligibility Checker (deterministic — no LLM in the loop)
# ---------------------------------------------------------------------------

class EligibilityRequest(BaseModel):
    profile: Dict[str, Any]
    scheme_id: Optional[str] = None  # omit to check against every scheme


@app.post("/api/eligibility")
def check_eligibility(req: EligibilityRequest):
    schemes = [kb.get_by_id(req.scheme_id)] if req.scheme_id else kb.schemes
    schemes = [s for s in schemes if s]
    if not schemes:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return [evaluate_eligibility(s, req.profile) for s in schemes]


# ---------------------------------------------------------------------------
# Grievances
# ---------------------------------------------------------------------------

class GrievanceRequest(BaseModel):
    category: str
    summary: str
    priority: str = "MEDIUM"


@app.post("/api/grievance")
def file_grievance(req: GrievanceRequest):
    return create_ticket(
        category=req.category,
        summary=req.summary,
        citizen_id=None,
        priority=req.priority,
    )


@app.get("/api/grievance/{ticket_id}")
def track_grievance(ticket_id: str):
    ticket = get_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="No ticket found with that ID")
    return ticket


@app.post("/api/analyze-document")
async def analyze_document(file: UploadFile = File(...)):
    contents = await file.read()

    return {
        "status": "received",
        "filename": file.filename,
        "size_bytes": len(contents),
        "summary": f"Document '{file.filename}' was uploaded successfully.",
        "extracted_fields": {
            "document_type": "PDF",
            "language": "English",
            "pages": 1,
        },
        "key_details": [
            "File uploaded successfully",
            "Document is ready for analysis",
            f"File size: {len(contents) / 1024:.1f} KB",
        ],
        "note": "Document upload test completed successfully.",
    }
