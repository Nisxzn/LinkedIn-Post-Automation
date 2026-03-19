"""
routes/posts.py
===============
Post generation and management endpoints.
All endpoints are JWT-protected — user_id is derived from the token.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timezone

from database.database import get_db
from database.models import Post, ScheduledPost, User
from services.ai_generator import generate_post
from core.dependencies import get_current_user

router = APIRouter()


class TopicSchema(BaseModel):
    topic: str


class SavePostSchema(BaseModel):
    content: str
    topic:   str = None


@router.post("/generate")
def generate(
    data: TopicSchema,
    current_user: User = Depends(get_current_user),
):
    """Generates an AI LinkedIn post for the authenticated user."""
    content = generate_post(data.topic)
    return {"post": content}


@router.post("/save")
def save_post(
    data: SavePostSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Saves the generated post as a draft for the authenticated user."""
    post = Post(user_id=current_user.id, content=data.content, status="draft")
    db.add(post)
    db.commit()
    db.refresh(post)
    return {"message": "Post saved", "post_id": post.id}


@router.get("/list")
def list_posts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns all posts (draft + posted) for the authenticated user."""
    posts = (
        db.query(Post)
        .filter(Post.user_id == current_user.id)
        .order_by(Post.created_at.desc())
        .all()
    )
    return posts


@router.get("/dashboard")
def dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns dashboard summary for the authenticated user:
      - stats: total_posts, scheduled, this_month
      - recent_posts: last 10 posts with id, topic (first 60 chars of content), status, created_at
    """
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    all_posts = (
        db.query(Post)
        .filter(Post.user_id == current_user.id)
        .order_by(Post.created_at.desc())
        .all()
    )

    scheduled_count = (
        db.query(ScheduledPost)
        .join(Post, ScheduledPost.post_id == Post.id)
        .filter(Post.user_id == current_user.id, ScheduledPost.status == "pending")
        .count()
    )

    this_month = sum(
        1 for p in all_posts
        if p.created_at and p.created_at.replace(tzinfo=timezone.utc) >= month_start
    )
    recent_posts = []
    for p in all_posts[:10]:
        recent_posts.append({
            "id":         p.id,
            "topic":      (p.content or "")[:60].replace("\n", " ") if p.content else "(no content)",
            "status":     p.status or "draft",
            "created_at": p.created_at.strftime("%Y-%m-%d") if p.created_at else "",
            "views":      0,
            "likes":      0,
        })

    return {
        "stats": {
            "total_posts": len(all_posts),
            "scheduled":   scheduled_count,
            "this_month":  this_month,
        },
        "recent_posts": recent_posts,
    }


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from services.linkedin_service import delete_linkedin_post
    from database.models import Analytics, ScheduledPost
    from fastapi import HTTPException
    
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    # Delete from LinkedIn if it was published and has an URN
    if post.linkedin_urn:
        success = delete_linkedin_post(current_user.linkedin_access_token, post.linkedin_urn)
        if not success:
            raise HTTPException(
                status_code=502, 
                detail="Failed to delete post on LinkedIn. Please check if the post still exists or if your token is valid."
            )
        
    # Delete from database
    db.query(Analytics).filter(Analytics.post_id == post_id).delete()
    db.query(ScheduledPost).filter(ScheduledPost.post_id == post_id).delete()
    db.delete(post)
    db.commit()
    
    return {"message": "Post deleted successfully from both app and LinkedIn"}
