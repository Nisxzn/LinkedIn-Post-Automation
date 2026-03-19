"""
Node 4: Schedule Post
Persists the improved post to the database as a Post record (status = "scheduled")
and creates a linked ScheduledPost record.

Scheduling logic:
  - If there is already a pending/future scheduled post, the new one is placed
    24 hours after the last one.
  - Otherwise the post is scheduled for tomorrow at 09:00 UTC.
"""

import logging
from datetime import datetime, timedelta, time
from typing import Any

from sqlalchemy import desc

from database.database import SessionLocal
from database.models import Post, ScheduledPost

logger = logging.getLogger("langgraph.schedule_post")


def schedule_post_node(state: dict[str, Any]) -> dict[str, Any]:
    """
    LangGraph node — Schedule Post.

    Saves the improved post to the DB and schedules it for publication.

    State inputs : improved_post (str), topic (str)
    State outputs: post_id (int), schedule_time (datetime)
    """
    logger.info("=== [Node 4] Schedule Post — START ===")

    improved_post: str = state.get("improved_post", "")
    if not improved_post:
        raise ValueError("No improved_post in state to schedule.")

    db = SessionLocal()
    try:
        # ── Determine the next available scheduling slot ──────────────────
        latest_job = (
            db.query(ScheduledPost)
            .order_by(desc(ScheduledPost.schedule_time))
            .first()
        )

        if latest_job and latest_job.schedule_time > datetime.utcnow():
            next_slot = latest_job.schedule_time + timedelta(days=1)
            logger.info("Last scheduled post found at %s → next slot: %s", latest_job.schedule_time, next_slot)
        else:
            tomorrow = datetime.utcnow() + timedelta(days=1)
            next_slot = datetime.combine(tomorrow.date(), time(9, 0))
            logger.info("No future scheduled post found → scheduling for: %s", next_slot)

        # ── Persist the Post record ───────────────────────────────────────
        new_post = Post(
            user_id=1,
            content=improved_post,
            status="scheduled",
        )
        db.add(new_post)
        db.flush()  # populate new_post.id without committing yet

        # ── Persist the ScheduledPost record ─────────────────────────────
        scheduled = ScheduledPost(
            post_id=new_post.id,
            schedule_time=next_slot,
            status="pending",
        )
        db.add(scheduled)
        db.commit()

        post_id = new_post.id
        logger.info(
            "Post ID=%d saved and scheduled for %s (ScheduledPost ID=%d)",
            post_id,
            next_slot,
            scheduled.id,
        )

    except Exception as exc:
        db.rollback()
        logger.error("Failed to schedule post: %s", exc)
        raise
    finally:
        db.close()

    logger.info("=== [Node 4] Schedule Post — END ===")

    return {**state, "post_id": post_id, "schedule_time": next_slot}
