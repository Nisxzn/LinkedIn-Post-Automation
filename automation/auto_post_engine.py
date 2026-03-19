from automation.content_discovery import discover_topics
from services.ai_generator import generate_post
from database.database import SessionLocal
from database.models import Post, AutomationSettings

def auto_generate_posts():
    """
    Fetches trending topics from RSS based on user-defined category,
    generates draft posts, and saves them to the database.
    """
    db = SessionLocal()
    
    # Get user defined category from settings
    settings = db.query(AutomationSettings).first()
    category = settings.category if settings else "AI"
    
    # Use category as search query for RSS
    search_query = category
    if category == "AI": search_query = "artificial intelligence"
    elif category == "Startups": search_query = "startups and entrepreneurship"
    elif category == "Tech": search_query = "latest technology"

    print(f"Discovering topics for category: {category}...")
    topics = discover_topics(search_query)

    for topic in topics:
        print(f"Generating post for: {topic}")
        post_content = generate_post(topic)

        # Ensure we don't duplicate many posts for the same topic
        existing_post = db.query(Post).filter(Post.status == "draft", Post.content == post_content).first()
        if not existing_post:
            post = Post(
                user_id=1,
                content=post_content,
                status="draft"
            )
            db.add(post)

    db.commit()
    db.close()
    print("Auto-generation of posts completed.")