"""
Deterministic eligibility engine.

This intentionally contains NO LLM calls. Eligibility for a government
benefit must be evaluated by plain, auditable code — the LLM's job is only
to collect the profile fields conversationally and narrate this engine's
result, never to decide eligibility itself.
"""

import operator
from enum import Enum
from typing import Any, Dict, List

OPS = {
    "==": operator.eq,
    "!=": operator.ne,
    "<": operator.lt,
    "<=": operator.le,
    ">": operator.gt,
    ">=": operator.ge,
}


class EligibilityResult(str, Enum):
    ELIGIBLE = "ELIGIBLE"
    NOT_ELIGIBLE = "NOT_ELIGIBLE"
    INSUFFICIENT_INFORMATION = "INSUFFICIENT_INFORMATION"


def evaluate_eligibility(scheme: Dict[str, Any],
                          profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    profile: dict of citizen-provided fields, e.g.
        {"is_student": True, "annual_family_income": 200000, ...}

    Returns a structured, auditable result — never a free-text LLM judgment.
    """
    criteria = scheme.get("eligibility_criteria", [])
    checks = []
    missing_fields = []

    for rule in criteria:
        field = rule["field"]
        if field not in profile or profile[field] is None:
            missing_fields.append(field)
            checks.append({
                "label": rule["label"],
                "status": "MISSING",
            })
            continue

        op_fn = OPS[rule["op"]]
        passed = op_fn(profile[field], rule["value"])
        checks.append({
            "label": rule["label"],
            "status": "PASS" if passed else "FAIL",
        })

    if missing_fields:
        result = EligibilityResult.INSUFFICIENT_INFORMATION
    elif all(c["status"] == "PASS" for c in checks):
        result = EligibilityResult.ELIGIBLE
    else:
        result = EligibilityResult.NOT_ELIGIBLE

    return {
        "scheme_id": scheme["id"],
        "scheme_name": scheme["name"],
        "result": result.value,
        "checks": checks,
        "missing_fields": missing_fields,
    }


REQUIRED_PROFILE_FIELDS_BY_SCHEME = {
    # Used by the orchestrator to know which questions to ask the citizen
    # before it can run evaluate_eligibility() meaningfully.
}


def required_fields_for(scheme: Dict[str, Any]) -> List[str]:
    return [rule["field"] for rule in scheme.get("eligibility_criteria", [])]
