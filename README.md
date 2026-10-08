# AI Government Assistant

A working, runnable core of the architecture we discussed: RAG-grounded
scheme discovery, a deterministic eligibility engine, and a grievance
agent, orchestrated by an LLM via tool-calling — plus a full React
frontend (sidebar nav, chat, schemes browser, eligibility checker,
grievance filing, application tracking, document upload UI, language
switch, voice input). Built so each backend piece can be swapped for a
production version without changing its interface.

Every file here has been syntax-checked and the frontend was bundle-built
successfully with esbuild before delivery — it should drop into VS Code
and run as-is, given the setup steps below.

## Project layout

```
govassist/
  backend/              FastAPI app (Python)
    main.py             REST endpoints
    orchestrator.py      the LLM layer — Claude tool-calling, RAG grounding
    knowledge_base.py    TF-IDF retrieval over backend/data/schemes.json
    eligibility_engine.py  deterministic rules engine (no LLM in the loop)
    grievance_agent.py     ticket creation/tracking (in-memory store)
  frontend/             React + Vite app
    src/App.jsx          page routing + language switch
    src/pages/            Home, Chat, Schemes, Eligibility, DocumentAnalyzer,
                           TrackApplication, FileGrievance
    src/components/Sidebar.jsx
    src/api.js            fetch wrapper for the backend
    src/i18n.js            English/Tamil/Hindi UI strings
```

## Run it

**Backend** (needs a Gemini API key, only for the `/api/chat` endpoint —
every other endpoint is deterministic and works without one):

```bash
cd backend
pip install -r requirements.txt
export GEMINI_API_KEY="your-gemini-api-key"
uvicorn main:app --reload --port 8000
```

**Frontend** (separate terminal):

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## What's real vs. a stub

Everything **except** OCR is wired end-to-end to the backend:
- Schemes & Benefits, Eligibility Checker, File Grievance, and Track
  Application all call real REST endpoints (`/api/schemes`,
  `/api/eligibility`, `/api/grievance`) and show real data — try filing a
  grievance, then tracking it by the tracking ID you get back.
- Chat uses Claude with tool-calling and RAG grounding (see
  `orchestrator.py`) — it will say it can't verify something rather than
  invent it, per the anti-hallucination rules we discussed.
- Voice input in Chat uses the browser's built-in Web Speech API (works in
  Chrome) — genuinely functional, no backend involved.
- **Document Analyzer is a UI stub only** — it accepts a file but does no
  OCR/extraction (see the note in `DocumentAnalyzer.jsx`), since that needs
  a real OCR pipeline you'll want to choose deliberately (see below).

## API endpoints

| Method | Path | Notes |
|---|---|---|
| POST | `/api/chat` | LLM orchestrator (needs `ANTHROPIC_API_KEY`) |
| GET | `/api/schemes?q=&state=` | List/search schemes |
| GET | `/api/schemes/{id}` | One scheme |
| POST | `/api/eligibility` | `{profile, scheme_id?}` → deterministic result(s) |
| POST | `/api/grievance` | `{category, summary, priority}` → creates a ticket |
| GET | `/api/grievance/{ticket_id}` | Look up ticket status |

## Next steps (not yet built here)

- Document Intelligence Agent (real OCR + field extraction) behind
  `DocumentAnalyzer.jsx` — it already has the upload UI waiting for it
- Multilingual chat backend (the UI shell already switches language; the
  LLM will follow the language you type in, but ASR/TTS beyond browser
  speech-to-text isn't built)
- Officer/Admin dashboard with RBAC-scoped queries
- Real case-management + application-tracking API integrations
- Swap TF-IDF retrieval for a multilingual embedding model + real vector DB
- Auth (JWT) and persistent storage (Redis/Postgres) instead of the
  in-memory stores used here for simplicity
