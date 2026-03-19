"""
routes/analytics.py
====================
Analytics endpoints — JWT-protected.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database.database import get_db
from database.models import Analytics, User, ScheduledPost, Post
from core.dependencies import get_current_user
from services.linkedin_service import syncLinkedInPostAnalytics

router = APIRouter()


@router.get("/post/{post_id:path}")
def get_analytics(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns analytics. Accepts internal DB post ID or a LinkedIn post URL."""
    import urllib.parse
    post_id = urllib.parse.unquote(post_id)
    post_url = ""

    if post_id.startswith("http://") or post_id.startswith("https://"):
        post_url = post_id
    else:
        # It's an integer ID from our DB
        try:
            db_post_id = int(post_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid post ID or URL format.")
            
        post = db.query(Post).filter(Post.id == db_post_id).first()
        
        if not post or post.status not in ["published", "posted"]:
            # Return empty stats for drafts or scheduled posts
            return {
                "total_views": 0, "likes": 0, "comments": 0, "shares": 0,
                "chart_data": [{"date": f"Day {i}", "views": 0, "likes": 0, "comments": 0, "shares": 0} for i in range(1, 6)]
            }

        if post.linkedin_urn:
            # Construct standard LinkedIn feed URL from URN
            post_url = f"https://www.linkedin.com/feed/update/{post.linkedin_urn}/"
        else:
            raise HTTPException(status_code=400, detail="Cannot find a LinkedIn URL for this post.")

    # Now we have post_url, run the scraper
    result = syncLinkedInPostAnalytics(post_url)
    
    if result.get("status") == "sync_failed" or result.get("error"):
        raise HTTPException(status_code=502, detail=result.get("message", "Unable to retrieve engagement metrics"))

    likes = result.get("likes", 0)
    comments = result.get("comments", 0)
    reposts = result.get("reposts", 0)
    impressions = result.get("impressions_estimated", 0)

    # Simple chart filling out the current values on Day 1
    chart_data = [
        {"date": "Day 1", "views": impressions, "likes": likes, "comments": comments, "shares": reposts},
        {"date": "Day 2", "views": impressions, "likes": likes, "comments": comments, "shares": reposts},
        {"date": "Day 3", "views": impressions, "likes": likes, "comments": comments, "shares": reposts},
        {"date": "Day 4", "views": impressions, "likes": likes, "comments": comments, "shares": reposts},
        {"date": "Day 5", "views": impressions, "likes": likes, "comments": comments, "shares": reposts},
    ]

    return {
        "total_views": impressions,
        "likes": likes,
        "comments": comments,
        "shares": reposts,
        "chart_data": chart_data
    }
