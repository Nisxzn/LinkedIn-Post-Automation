"""
services/linkedin_service.py
=============================
Handles all LinkedIn OAuth 2.0 and LinkedIn REST API interactions.

Flow
----
1. build_auth_url()         → redirect URL sent to frontend → user goes to LinkedIn
2. exchange_code_for_token()→ backend exchanges auth code for access_token
3. get_linkedin_profile()   → fetches user's LinkedIn URN (needed for posting)
4. post_to_linkedin()       → publishes a text post on behalf of the user
"""

import os
import logging
from typing import Optional
import requests
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("services.linkedin")

# ─── Env vars ──────────────────────────────────────────────────────────────────
LINKEDIN_CLIENT_ID     = os.getenv("LINKEDIN_CLIENT_ID", "")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET", "")
LINKEDIN_REDIRECT_URI  = os.getenv(
    "LINKEDIN_REDIRECT_URI",
    "http://localhost:5173/linkedin/callback"
)

# OAuth endpoints
AUTH_URL     = "https://www.linkedin.com/oauth/v2/authorization"
TOKEN_URL    = "https://www.linkedin.com/oauth/v2/accessToken"
PROFILE_URL  = "https://api.linkedin.com/v2/userinfo"
POSTS_URL    = "https://api.linkedin.com/v2/ugcPosts"

# Required scopes
SCOPES = "openid profile email w_member_social"


# ─── OAuth URL builder ─────────────────────────────────────────────────────────

def build_auth_url(state: str = "linkedin_oauth") -> str:
    """
    Constructs the LinkedIn OAuth 2.0 authorization URL.

    The frontend redirects the user to this URL.  LinkedIn then sends them
    back to LINKEDIN_REDIRECT_URI with ``?code=...&state=...``.
    """
    params = (
        f"response_type=code"
        f"&client_id={LINKEDIN_CLIENT_ID}"
        f"&redirect_uri={LINKEDIN_REDIRECT_URI}"
        f"&scope={SCOPES.replace(' ', '%20')}"
        f"&state={state}"
    )
    return f"{AUTH_URL}?{params}"


# ─── Token exchange ────────────────────────────────────────────────────────────

def exchange_code_for_token(code: str) -> Optional[dict]:
    """
    Exchanges the authorization code LinkedIn sent to the callback URL
    for an access token.

    Returns a dict with ``access_token`` on success, or None on failure.
    """
    if not LINKEDIN_CLIENT_ID or not LINKEDIN_CLIENT_SECRET:
        logger.error(
            "LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET is not set. "
            "Please configure these environment variables."
        )
        return None

    payload = {
        "grant_type":    "authorization_code",
        "code":          code,
        "redirect_uri":  LINKEDIN_REDIRECT_URI,
        "client_id":     LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
    }

    try:
        response = requests.post(TOKEN_URL, data=payload, timeout=15)
        response.raise_for_status()
        token_data = response.json()
        logger.info("LinkedIn token exchange successful.")
        return token_data
    except requests.HTTPError as e:
        logger.error(
            "LinkedIn token exchange failed: %s — %s",
            e,
            e.response.text if e.response else "no body",
        )
        return None
    except Exception as e:
        logger.error("Unexpected error during LinkedIn token exchange: %s", e)
        return None


# ─── Profile fetch ─────────────────────────────────────────────────────────────

def get_linkedin_profile(access_token: str) -> Optional[dict]:
    """
    Fetches the authenticated user's LinkedIn OIDC profile (sub, name, email …).

    The ``sub`` field is the LinkedIn URN needed to create UGC posts.
    """
    try:
        resp = requests.get(
            PROFILE_URL,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error("Failed to fetch LinkedIn profile: %s", e)
        return None


# ─── Post publisher ────────────────────────────────────────────────────────────

def post_to_linkedin(access_token: str, linkedin_urn: str, content: str) -> Optional[str]:
    """
    Publishes a text-only UGC post to LinkedIn on behalf of the user.

    Parameters
    ----------
    access_token : The user's LinkedIn access token (stored in DB).
    linkedin_urn : LinkedIn Person URN, e.g. ``"urn:li:person:ABCDE12345"``.
    content      : The post text to publish.

    Returns the published generic LinkedIn URN on success, None on failure.
    """
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type":  "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
    }

    body = {
        "author":          linkedin_urn,
        "lifecycleState":  "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": content
                },
                "shareMediaCategory": "NONE",
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        },
    }

    try:
        resp = requests.post(POSTS_URL, json=body, headers=headers, timeout=20)
        resp.raise_for_status()
        post_urn = resp.headers.get("x-restli-id")
        logger.info("LinkedIn post published successfully. Post URN: %s", post_urn)
        return post_urn
    except requests.HTTPError as e:
        logger.error(
            "LinkedIn post failed (HTTP %s): %s",
            e.response.status_code if e.response else "?",
            e.response.text if e.response else str(e),
        )
        return None
    except Exception as e:
        logger.error("Unexpected error publishing LinkedIn post: %s", e)
        return None


def get_linkedin_post_analytics(access_token: str, post_urn: str) -> dict:
    """
    Retrieves real LinkedIn analytics (likes, comments) for a UGC post using socialActions API.
    """
    encoded_urn = urllib.parse.quote(post_urn)
    url = f"https://api.linkedin.com/v2/socialActions/{encoded_urn}"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Restli-Protocol-Version": "2.0.0",
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        # LinkedIn returns 403 (FORBIDDEN) if r_member_social is missing
        if resp.status_code == 403:
             return {"error": True, "error_detail": "PERMISSION_DENIED_READ"}
             
        if resp.status_code != 200:
            logger.error("LinkedIn socialActions failure (HTTP %s): %s", resp.status_code, resp.text)
            return {"error": True, "error_detail": f"HTTP {resp.status_code}: {resp.text}"}
            
        resp.raise_for_status()
        data = resp.json()
        return {
            "likes": data.get("likesSummary", {}).get("totalLikes", 0),
            "comments": data.get("commentsSummary", {}).get("totalFirstLevelComments", 0),
            "shares": 0, "views": 0
        }
    except Exception as e:
        logger.error("Analytics fetch error for %s: %s", post_urn, e)
        return {"error": True, "error_detail": str(e)}

def syncLinkedInPostAnalytics(post_url: str) -> dict:
    """
    1. Receive post URL
    2. Scrape engagement metrics
    3. Normalize numeric values
    4. Store results in database
    5. Return analytics JSON response
    """
    import re
    from datetime import datetime
    from playwright.sync_api import sync_playwright
    from database.database import SessionLocal
    from database.models import Analytics, Post

    # Extract postId from the URL Format: https://www.linkedin.com/posts/{username}_{postId}
    # Or from URN format: https://www.linkedin.com/feed/update/urn:li:share:{postId}/
    match = re.search(r'([0-9]{15,})(?:[-/]|$)', post_url)
    post_id_extracted = match.group(1) if match else None

    likes = 0
    comments = 0
    reposts = 0

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            page = context.new_page()
            page.goto(post_url, wait_until="domcontentloaded", timeout=45000)
            page.wait_for_timeout(4000)
            
            text = page.inner_text("body")

            def parse_num(s):
                if not s: return 0
                s = s.lower().replace(',', '').strip()
                if 'k' in s: return int(float(s.replace('k','')) * 1000)
                if 'm' in s: return int(float(s.replace('m','')) * 1000000)
                try:
                    return int(s)
                except:
                    return 0

            likes_match = re.search(r'([0-9,kKmM.]+)\s*Likes?', text, re.IGNORECASE)
            comments_match = re.search(r'([0-9,kKmM.]+)\s*Comments?', text, re.IGNORECASE)
            reposts_match = re.search(r'([0-9,kKmM.]+)\s*Reposts?', text, re.IGNORECASE)

            if likes_match: likes = parse_num(likes_match.group(1))
            if comments_match: comments = parse_num(comments_match.group(1))
            if reposts_match: reposts = parse_num(reposts_match.group(1))

            browser.close()

        impressions_estimated = (likes + comments + reposts) * 15

        # Store in database
        db = SessionLocal()
        try:
            # Find the post matching the extracted post ID from linkedin_urn
            # urn:li:share:12345 or urn:li:ugcPost:12345
            post = None
            if post_id_extracted:
                post = db.query(Post).filter(Post.linkedin_urn.like(f"%{post_id_extracted}%")).first()
            
            if post:
                analytics = db.query(Analytics).filter(Analytics.post_id == post.id).first()
                if not analytics:
                    analytics = Analytics(post_id=post.id)
                    db.add(analytics)
                
                analytics.likes = likes
                analytics.comments = comments
                # Set manual fields if using the modified schema or repurpose 'shares'
                analytics.shares = reposts 
                analytics.views = impressions_estimated
                # Using direct execution to avoid requiring models.py rewrite if it breaks
                from sqlalchemy import text
                db.execute(
                    text("UPDATE analytics SET post_url = :url, reposts = :rep, impressions_estimated = :imp, last_synced_at = :ts WHERE id = :id"),
                    {"url": post_url, "rep": reposts, "imp": impressions_estimated, "ts": datetime.utcnow(), "id": analytics.id}
                )
                db.commit()
        finally:
            db.close()

        return {
            "likes": likes,
            "comments": comments,
            "reposts": reposts,
            "impressions_estimated": impressions_estimated
        }

    except Exception as e:
        logger.error(f"Scraper error for {post_url}: {e}")
        return {
            "status": "sync_failed",
            "message": "Unable to retrieve engagement metrics"
        }


def delete_linkedin_post(access_token: str, post_urn: str) -> bool:
    """
    Deletes a UGC post on LinkedIn.
    """
    if not post_urn:
        return True
        
    encoded_urn = urllib.parse.quote(post_urn)
    url = f"https://api.linkedin.com/v2/ugcPosts/{encoded_urn}"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Restli-Protocol-Version": "2.0.0",
    }
    
    try:
        resp = requests.delete(url, headers=headers, timeout=20)
        resp.raise_for_status()
        logger.info("LinkedIn post %s deleted successfully.", post_urn)
        return True
    except requests.HTTPError as e:
        if e.response and e.response.status_code == 404:
            # Already deleted or not found
            return True
        logger.error("Failed to delete LinkedIn post %s: %s", post_urn, e)
        return False
    except Exception as e:
        logger.error("Unexpected error deleting LinkedIn post %s: %s", post_urn, e)
        return False
