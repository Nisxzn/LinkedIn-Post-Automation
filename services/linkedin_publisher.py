"""
services/linkedin_publisher.py
================================
Adapter used by the LangGraph publish_post node and the APScheduler.

For scheduled/automated posts, the publisher fetches the user's stored
LinkedIn access token from the database and calls the LinkedIn API.
"""

import logging
from database.database import SessionLocal
from database.models import User, Post
from services.linkedin_service import post_to_linkedin

logger = logging.getLogger("services.linkedin_publisher")


def publish_post(content: str, user_id: int = 1) -> bool:
    """
    Publishes *content* to LinkedIn using the stored access token of *user_id*.

    Called by:
      - automation/nodes/publish_post.py  (scheduled automation)
      - APScheduler check_scheduled_posts job

    Returns True on success, False on failure.
    """
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            logger.error("[Publisher] User ID=%d not found in database.", user_id)
            return False

        if not user.linkedin_connected or not user.linkedin_access_token:
            logger.warning(
                "[Publisher] User ID=%d has no LinkedIn account connected. "
                "Skipping publish.",
                user_id,
            )
            return False

        if not user.linkedin_id:
            logger.error(
                "[Publisher] User ID=%d has no LinkedIn URN stored. "
                "Cannot publish without knowing the author URN.",
                user_id,
            )
            return False

        linkedin_urn = f"urn:li:person:{user.linkedin_id}"

        success = post_to_linkedin(
            access_token=user.linkedin_access_token,
            linkedin_urn=linkedin_urn,
            content=content,
        )

        if success:
            logger.info("[Publisher] Post published for User ID=%d.", user_id)
        else:
            logger.error("[Publisher] LinkedIn API rejected the post for User ID=%d.", user_id)

        return success

    except Exception as exc:
        logger.error("[Publisher] Unexpected error for User ID=%d: %s", user_id, exc, exc_info=True)
        return False
    finally:
        db.close()
