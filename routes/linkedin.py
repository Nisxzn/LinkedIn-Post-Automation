"""
routes/linkedin.py
==================
LinkedIn OAuth 2.0 integration and posting endpoints.

GET  /linkedin/auth       — returns the LinkedIn authorize URL for the frontend
POST /linkedin/callback   — exchanges the auth code for a token and saves it
POST /linkedin/post       — publishes post content to the user's LinkedIn feed
POST /linkedin/disconnect — removes stored LinkedIn credentials
GET  /linkedin/status     — returns LinkedIn connection status for current user
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database.database import get_db
from database.models import User, Post
from core.dependencies import get_current_user
from services.linkedin_service import (
    build_auth_url,
    exchange_code_for_token,
    get_linkedin_profile,
    post_to_linkedin,
)

logger = logging.getLogger("routes.linkedin")
router = APIRouter()


# ─── Schemas ───────────────────────────────────────────────────────────────────

class CallbackSchema(BaseModel):
    code:  str
    state: str = "linkedin_oauth"


from typing import Optional

class PostSchema(BaseModel):
    content: str
    topic: Optional[str] = None
    post_id: Optional[int] = None


# ─── OAuth initiation ──────────────────────────────────────────────────────────

@router.get("/auth")
def linkedin_auth(current_user: User = Depends(get_current_user)):
    """
    Returns the LinkedIn OAuth 2.0 authorization URL.
    The frontend redirects the user to this URL.
    """
    auth_url = build_auth_url(state=f"user_{current_user.id}")
    return {"auth_url": auth_url}


# ─── OAuth callback ────────────────────────────────────────────────────────────

@router.post("/callback")
def linkedin_callback(
    data: CallbackSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Exchanges the LinkedIn authorization code for an access token.
    Fetches the user's LinkedIn profile and stores credentials in the DB.
    """
    # Exchange code for tokens
    token_data = exchange_code_for_token(data.code)
    if not token_data or "access_token" not in token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange LinkedIn authorization code. Please try connecting again.",
        )

    access_token  = token_data["access_token"]
    refresh_token = token_data.get("refresh_token")  # LinkedIn does not always issue refresh tokens

    # Fetch LinkedIn profile to get the user's URN (sub)
    profile = get_linkedin_profile(access_token)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="LinkedIn account connected but failed to fetch profile information.",
        )

    linkedin_id = profile.get("sub") or profile.get("id")

    # Persist tokens
    user = db.query(User).filter(User.id == current_user.id).first()
    user.linkedin_access_token  = access_token
    user.linkedin_refresh_token = refresh_token
    user.linkedin_id            = linkedin_id
    user.linkedin_connected     = True
    db.commit()

    logger.info(
        "User ID=%d successfully connected LinkedIn account (LinkedIn ID=%s)",
        current_user.id,
        linkedin_id,
    )

    return {
        "message":           "LinkedIn account connected successfully.",
        "linkedin_id":       linkedin_id,
        "linkedin_name":     profile.get("name"),
        "linkedin_email":    profile.get("email"),
        "linkedin_picture":  profile.get("picture"),
    }


# ─── Post publisher ────────────────────────────────────────────────────────────

@router.post("/post")
def linkedin_post(
    data: PostSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Publishes the provided content to the user's LinkedIn profile.
    Requires the user to have their LinkedIn account connected.
    """
    if not current_user.linkedin_connected:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="LinkedIn account not connected. Please connect your LinkedIn account first.",
        )

    if not current_user.linkedin_access_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="LinkedIn access token is missing. Please reconnect your LinkedIn account.",
        )

    if not current_user.linkedin_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="LinkedIn identity (URN) is missing. Please reconnect your LinkedIn account.",
        )

    content = data.content.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Post content cannot be empty.",
        )

    # Build the LinkedIn Person URN
    linkedin_urn = f"urn:li:person:{current_user.linkedin_id}"

    post_urn_result = post_to_linkedin(
        access_token=current_user.linkedin_access_token,
        linkedin_urn=linkedin_urn,
        content=content,
    )

    if not post_urn_result:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "Failed to publish to LinkedIn. Your access token may have expired. "
                "Please disconnect and reconnect your LinkedIn account."
            ),
        )

    # Update or create the post in the database
    post = None
    if data.post_id:
        post = db.query(Post).filter(Post.id == data.post_id, Post.user_id == current_user.id).first()
        if post:
            post.status = "published"
            post.linkedin_urn = post_urn_result
            db.commit()
            db.refresh(post)
            
    if not post:
        post = Post(user_id=current_user.id, content=content, status="published", linkedin_urn=post_urn_result)
        db.add(post)
        db.commit()
        db.refresh(post)

    logger.info("User ID=%d published post to LinkedIn successfully.", current_user.id)
    return {
        "message": "Post published to LinkedIn successfully.",
        "post_id": post.id
    }


# ─── Status ────────────────────────────────────────────────────────────────────

@router.get("/status")
def linkedin_status(current_user: User = Depends(get_current_user)):
    """Returns the LinkedIn connection status for the current authenticated user."""
    return {
        "connected":    current_user.linkedin_connected,
        "linkedin_id":  current_user.linkedin_id,
    }


# ─── Disconnect ────────────────────────────────────────────────────────────────

@router.post("/disconnect")
def linkedin_disconnect(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Removes the stored LinkedIn credentials for the current user.
    Does NOT revoke the token on LinkedIn's side (that requires a separate API call).
    """
    user = db.query(User).filter(User.id == current_user.id).first()
    user.linkedin_access_token  = None
    user.linkedin_refresh_token = None
    user.linkedin_id            = None
    user.linkedin_connected     = False
    db.commit()

    logger.info("User ID=%d disconnected LinkedIn account.", current_user.id)
    return {"message": "LinkedIn account disconnected successfully."}
