"""
routes/automation_routes.py
============================
FastAPI router for all /automation/* endpoints — JWT-protected.

POST /automation/run                  — manually trigger LangGraph pipeline
GET  /automation/settings             — get current automation settings
POST /automation/settings/update      — update automation settings
POST /automation/run-content-discovery— [legacy] triggers content discovery
POST /automation/run-smart-scheduler  — [legacy] triggers smart scheduler
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database.database import get_db
from database.models import AutomationSettings, User
from core.dependencies import get_current_user

logger = logging.getLogger("routes.automation")
router = APIRouter()


# ─── Schemas ──────────────────────────────────────────────────────────────────

class AutomationUpdateSchema(BaseModel):
    is_active:     int | None = None
    category:      str | None = None
    auto_schedule: int | None = None


# ─── Settings endpoints ───────────────────────────────────────────────────────

@router.get("/settings")
def get_automation_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns the current automation settings."""
    settings = db.query(AutomationSettings).first()
    if not settings:
        return {"is_active": 1, "category": "AI", "auto_schedule": 1}
    return settings


@router.post("/settings/update")
def update_automation_settings(
    data: AutomationUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Updates the automation settings (partial update supported)."""
    settings = db.query(AutomationSettings).first()
    if not settings:
        settings = AutomationSettings()
        db.add(settings)

    if data.is_active is not None:
        settings.is_active = data.is_active
    if data.category is not None:
        settings.category = data.category
    if data.auto_schedule is not None:
        settings.auto_schedule = data.auto_schedule

    db.commit()
    db.refresh(settings)
    return {"message": "Settings updated", "settings": settings}


# ─── LangGraph pipeline endpoint ──────────────────────────────────────────────

@router.post("/run")
def run_automation_pipeline(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
):
    """
    Manually triggers the LangGraph automation workflow in the background.
    Pipeline: discover_topics → generate_post → improve_post → schedule_post
    """
    from automation.langgraph_flow import run_langgraph_workflow

    logger.info(
        "Manual trigger: LangGraph pipeline requested by User ID=%d via API.",
        current_user.id,
    )

    def _run():
        try:
            result = run_langgraph_workflow()
            logger.info(
                "Manual pipeline finished — Post ID=%s, Scheduled for %s",
                result.get("post_id", "N/A"),
                result.get("schedule_time", "N/A"),
            )
        except Exception as exc:
            logger.error("Manual pipeline failed: %s", exc, exc_info=True)

    background_tasks.add_task(_run)

    return {
        "message": (
            "LangGraph automation pipeline triggered successfully. "
            "Check server logs for progress."
        ),
        "pipeline": "discover_topics → generate_post → improve_post → schedule_post",
    }


# ─── Legacy endpoints (preserved for backwards compatibility) ─────────────────

@router.post("/run-content-discovery")
def trigger_discovery(current_user: User = Depends(get_current_user)):
    """[Legacy] Triggers content discovery and post generation."""
    from automation.langgraph_flow import run_langgraph_workflow
    try:
        result = run_langgraph_workflow()
        return {
            "message":       "Content discovery and generation triggered via LangGraph.",
            "post_id":       result.get("post_id"),
            "schedule_time": str(result.get("schedule_time", "")),
        }
    except Exception as exc:
        logger.error("Legacy content-discovery trigger failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/run-smart-scheduler")
def trigger_scheduler(current_user: User = Depends(get_current_user)):
    """[Legacy] Triggers the smart scheduler to schedule existing drafts."""
    from automation.langgraph_flow import run_langgraph_workflow
    try:
        result = run_langgraph_workflow()
        return {
            "message":       "Smart scheduler triggered via LangGraph pipeline.",
            "post_id":       result.get("post_id"),
            "schedule_time": str(result.get("schedule_time", "")),
        }
    except Exception as exc:
        logger.error("Legacy smart-scheduler trigger failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))
