from datetime import datetime, timedelta, time
from database.database import SessionLocal
from database.models import Post, ScheduledPost
from sqlalchemy import desc

def auto_schedule_posts():
    """
    Schedules draft posts one per day. 
    It checks the latest scheduled post and sets the next one for 24 hours later.
    """
    db = SessionLocal()

    # Get all drafts
    drafts = db.query(Post).filter(Post.status=="draft").all()
    if not drafts:
        db.close()
        return

    # Find the latest scheduled post to know when to start the next one
    latest_job = db.query(ScheduledPost).order_by(desc(ScheduledPost.schedule_time)).first()
    
    # Start either from tomorrow 9am or 24h after the last scheduled one
    if latest_job and latest_job.schedule_time > datetime.utcnow():
        next_available_slot = latest_job.schedule_time + timedelta(days=1)
    else:
        # Start tomorrow morning at 09:00 UTC
        tomorrow = datetime.utcnow() + timedelta(days=1)
        next_available_slot = datetime.combine(tomorrow.date(), time(9, 0))

    # Schedule them one by one, each 24 hours apart
    for post in drafts:
        print(f"Scheduling post {post.id} for {next_available_slot}")
        
        schedule = ScheduledPost(
            post_id=post.id,
            schedule_time=next_available_slot,
            status="pending"
        )
        db.add(schedule)
        
        post.status = "scheduled"
        
        # Increment for the next post in the list
        next_available_slot += timedelta(days=1)

    db.commit()
    db.close()
    print("Auto-scheduling completed: 1 post per day cadence applied.")