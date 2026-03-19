"""
Node 1: Discover Topics
Fetches trending topics from Google News RSS feed based on the user's
configured automation category. Returns a list of topic titles for
the next node to process.
"""

import logging
from typing import Any

from services.news_fetcher import fetch_ai_news
from database.database import SessionLocal
from database.models import AutomationSettings

logger = logging.getLogger("langgraph.discover_topics")

# Maps AutomationSettings.category → Google News search query
CATEGORY_QUERY_MAP = {
    "AI": "artificial intelligence",
    "Startups": "startups and entrepreneurship",
    "Tech": "latest technology",
    "Marketing": "digital marketing strategy",
    "Finance": "fintech and finance",
}


def discover_topics_node(state: dict[str, Any]) -> dict[str, Any]:
    """
    LangGraph node — Discover Topics.

    Reads the user's configured category from AutomationSettings, fetches the
    latest RSS headlines, and stores a list of topic strings in the shared state.

    State inputs : (none required – reads fresh from DB)
    State outputs: topics (list[str])
    """
    logger.info("=== [Node 1] Discover Topics — START ===")

    db = SessionLocal()
    try:
        settings = db.query(AutomationSettings).first()
        category = settings.category if settings else "AI"
    finally:
        db.close()

    query = CATEGORY_QUERY_MAP.get(category, category)
    logger.info("Fetching RSS topics for category '%s' (query: '%s')", category, query)

    articles = fetch_ai_news(query)
    topics = [article["title"] for article in articles if article.get("title")]

    if not topics:
        logger.warning("No topics discovered — using fallback topic.")
        topics = [f"The future of {query}"]

    logger.info("Discovered %d topic(s): %s", len(topics), topics)
    logger.info("=== [Node 1] Discover Topics — END ===")

    return {**state, "topics": topics}
