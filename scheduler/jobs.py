"""
scheduler/jobs.py
=================
APScheduler job definitions for the LinkedIn AI Automation SaaS.

Change from previous version
-----------------------------
The scheduler no longer calls raw Python automation functions directly.
Instead it triggers the **LangGraph workflow pipeline**:

  Daily cadence:
    • run_langgraph_workflow()   — discover topics → generate → improve → schedule
    • check_scheduled_posts()   — publish any posts whose schedule_time has passed

The publish step is handled by check_scheduled_posts via publish_single_post()
from the LangGraph layer, keeping the full stack consistent.
"""

import logging
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from database.database import SessionLocal
from database.models import ScheduledPost, AutomationSettings

logger = logging.getLogger("scheduler")
scheduler = BackgroundScheduler()


# ─── Helper ───────────────────────────────────────────────────────────────────

def _get_automation_settings():
    """Returns the AutomationSettings row (or sensible defaults)."""
    db = SessionLocal()
    try:
        settings = db.query(AutomationSettings).first()
        return settings
    finally:
        db.close()


def check_automation_active() -> bool:
    settings = _get_automation_settings()
    active = settings.is_active if settings else 1
    return active == 1


# ─── Jobs ─────────────────────────────────────────────────────────────────────

def check_scheduled_posts():
    """
    Hourly job: publishes any ScheduledPost records whose time has arrived.
    Uses publish_single_post() from the LangGraph layer.
    """
    logger.info("[Scheduler] Checking scheduled posts at %s (UTC)", datetime.utcnow())

    # Import here to avoid circular imports at module load time
    from automation.langgraph_flow import publish_single_post

    db: Session = SessionLocal()
    try:
        pending_jobs = (
            db.query(ScheduledPost)
            .filter(ScheduledPost.status == "pending")
            .all()
        )
        for job in pending_jobs:
            if job.schedule_time <= datetime.utcnow():
                logger.info("[Scheduler] Triggering publish for Post ID=%d", job.post_id)
                try:
                    publish_single_post(job.post_id)
                    logger.info("[Scheduler] Post ID=%d published successfully.", job.post_id)
                except Exception as exc:
                    logger.error(
                        "[Scheduler] Failed to publish Post ID=%d: %s",
                        job.post_id,
                        exc,
                        exc_info=True,
                    )
    except Exception as exc:
        logger.error("[Scheduler] Error in check_scheduled_posts: %s", exc, exc_info=True)
    finally:
        db.close()


def run_langgraph_pipeline():
    """
    Daily job: triggers the full LangGraph automation workflow.

    Flow: discover_topics → generate_post → improve_post → schedule_post

    Only runs if automation is enabled in AutomationSettings.
    """
    if not check_automation_active():
        logger.info("[Scheduler] Automation is disabled — skipping LangGraph pipeline.")
        return

    settings = _get_automation_settings()
    auto_schedule_enabled = settings.auto_schedule if settings else 1

    if not auto_schedule_enabled:
        logger.info("[Scheduler] Auto-schedule is disabled — skipping LangGraph pipeline.")
        return

    logger.info("[Scheduler] Triggering LangGraph automation pipeline …")

    # Import here to avoid circular imports at module load time
    from automation.langgraph_flow import run_langgraph_workflow

    try:
        result = run_langgraph_workflow()
        logger.info(
            "[Scheduler] LangGraph pipeline completed — Post ID=%s, Scheduled for %s",
            result.get("post_id", "N/A"),
            result.get("schedule_time", "N/A"),
        )
    except Exception as exc:
        logger.error("[Scheduler] LangGraph pipeline failed: %s", exc, exc_info=True)


# ─── Scheduler startup ────────────────────────────────────────────────────────

def start_scheduler():
    """
    Registers all jobs and starts the APScheduler background scheduler.

    Jobs:
      check_scheduled_posts  — every 1 hour  (publishes due posts)
      run_langgraph_pipeline — every 1 day   (full content-generation pipeline)
    """
    # Publish due posts every hour
    scheduler.add_job(check_scheduled_posts, "interval", hours=1, id="check_scheduled_posts")

    # Run the full LangGraph pipeline once per day
    scheduler.add_job(run_langgraph_pipeline, "interval", days=1, id="langgraph_pipeline")

    scheduler.start()
    logger.info("APScheduler started — LangGraph pipeline runs daily, publish check runs hourly.")
    print("Automation Scheduler Started — LangGraph pipeline (1/day) + publish check (1/hr)")