"""
Grievance agent.

Classifies a citizen's complaint and creates a ticket. In this prototype the
"backend" is an in-memory list — swap `_TICKETS` and the functions below for
real calls to your case-management system / database before going to
production. Critically: a tracking ID is only ever returned after a ticket
is actually created here, never invented by the LLM.
"""

import itertools
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

_TICKETS: List[Dict[str, Any]] = []
_counter = itertools.count(1)

CATEGORY_DEPARTMENT_MAP = {
    "scholarship_payment": "Ministry of Education - Scholarship Cell",
    "housing_benefit": "Ministry of Rural Development",
    "pension_delay": "Ministry of Social Justice and Empowerment",
    "document_issue": "District Administration Office",
    "other": "General Public Grievance Cell",
}


def create_ticket(category: str, summary: str, citizen_id: Optional[str],
                   priority: str = "MEDIUM") -> Dict[str, Any]:
    department = CATEGORY_DEPARTMENT_MAP.get(category, CATEGORY_DEPARTMENT_MAP["other"])
    ticket = {
        "ticket_id": f"GRV-{next(_counter):06d}-{uuid.uuid4().hex[:6].upper()}",
        "category": category,
        "department": department,
        "summary": summary,
        "citizen_id": citizen_id,
        "priority": priority,
        "status": "SUBMITTED",
        "created_at": datetime.utcnow().isoformat(),
    }
    _TICKETS.append(ticket)
    return ticket


def get_ticket(ticket_id: str) -> Optional[Dict[str, Any]]:
    for t in _TICKETS:
        if t["ticket_id"] == ticket_id:
            return t
    return None


def list_tickets(department: Optional[str] = None) -> List[Dict[str, Any]]:
    if department:
        return [t for t in _TICKETS if t["department"] == department]
    return list(_TICKETS)
