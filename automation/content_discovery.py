from services.news_fetcher import fetch_ai_news

def discover_topics(query="artificial intelligence"):
    """
    Fetches news titles related to a specific category query via RSS.
    Supports AI, Startups, Tech etc.
    """
    news = fetch_ai_news(query)

    topics = []
    for article in news:
        # Some RSS titles look like "Title - Publisher"
        # We'll just take the title as it is.
        topics.append(article["title"])

    return topics