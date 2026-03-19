"""
Node 5: Publish Post
Called by the APScheduler job when a ScheduledPost's time arrives.

Unlike the previous four nodes, this node is normally invoked with a
specific post_id and skips the topic-discovery / generation chain.
It can however be dropped into the end of the full pipeline for an
"immediate publish" scenario.

Behaviour:
  1. Loads the Post and its ScheduledPost record from the DB.
  2. Calls the LinkedIn publisher service (stub or real OAuth token).
  3. Updates Post.status → "posted" and ScheduledPost.status → "completed".
  4. Creates an Analytics seed row for the new post.
"""

import logging
from datetime import datetime
from typing import Any

from database.database import SessionLocal
from database.models import Post, ScheduledPost, Analytics
from services.linkedin_publisher import publish_post

logger = logging.getLogger("langgraph.publish_post")


def publish_post_node(state: dict[str, Any]) -> dict[str, Any]:
    """
    LangGraph node — Publish Post.

    Can be called:
      • At the end of the full pipeline (immediate-publish mode) — reads
        post_id and improved_post from state.
      • Standalone by the scheduler — only needs post_id in state.

    State inputs : post_id (int), [improved_post] (str, optional)
    State outputs: published (bool), publish_time (datetime)
    """
    logger.info("=== [Node 5] Publish Post — START ===")

    post_id: int = state.get("post_id")
    if not post_id:
        raise ValueError("No post_id in state — cannot publish.")

    db = SessionLocal()
    try:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise ValueError(f"Post ID={post_id} not found in the database.")

        scheduled_job = (
            db.query(ScheduledPost)
            .filter(ScheduledPost.post_id == post_id, ScheduledPost.status == "pending")
            .first()
        )

        # ── Publish ────────────────────────────────────────────────────────
        logger.info("Publishing Post ID=%d …", post_id)
        publish_post(post.content)

        publish_time = datetime.utcnow()

        # ── Update records ─────────────────────────────────────────────────
        post.status = "posted"
        if scheduled_job:
            scheduled_job.status = "completed"

        # ── Seed Analytics row ─────────────────────────────────────────────
        existing_analytics = (
            db.query(Analytics).filter(Analytics.post_id == post_id).first()
        )
        if not existing_analytics:
            db.add(Analytics(post_id=post_id, views=0, likes=0, comments=0, shares=0))

        db.commit()
        logger.info("Post ID=%d published successfully at %s", post_id, publish_time)

    except Exception as exc:
        db.rollback()
        logger.error("Failed to publish Post ID=%d: %s", post_id, exc)
        raise
    finally:
        db.close()

    logger.info("=== [Node 5] Publish Post — END ===")

    return {**state, "published": True, "publish_time": publish_time}
