"""
routes/scheduler_routes.py
===========================
Schedule management endpoints — JWT-protected.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel

from database.database import get_db
from database.models import ScheduledPost, Post, User
from core.dependencies import get_current_user

router = APIRouter()


class ScheduleSchema(BaseModel):
    post_id:        int
    scheduled_time: str


@router.post("/create")
def schedule_post(
    data: ScheduleSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Schedules a post for future publication."""
    try:
        time = datetime.fromisoformat(data.scheduled_time.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format.")

    job = ScheduledPost(post_id=data.post_id, schedule_time=time, status="pending")
    db.add(job)
    db.commit()
    return {"message": "Post scheduled"}


@router.get("/list")
def list_scheduled(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns all pending scheduled posts belonging to the authenticated user.
    Joins ScheduledPost with Post to filter by user_id.
    """
    rows = (
        db.query(ScheduledPost, Post)
        .join(Post, ScheduledPost.post_id == Post.id)
        .filter(
            Post.user_id     == current_user.id,
            ScheduledPost.status == "pending",
        )
        .order_by(ScheduledPost.schedule_time.asc())
        .all()
    )

    return [
        {
            "id":             sp.id,
            "post_id":        sp.post_id,
            "topic":          (post.content or "")[:60].replace("\n", " "),
            "scheduled_time": sp.schedule_time.isoformat() if sp.schedule_time else None,
            "status":         sp.status,
        }
        for sp, post in rows
    ]
