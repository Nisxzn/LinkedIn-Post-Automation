
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def init_db():
    from .models import User, Post, ScheduledPost, Analytics, AutomationSettings
    Base.metadata.create_all(bind=engine)
    
    # Create default settings if not exists
    db = SessionLocal()
    if not db.query(AutomationSettings).first():
        default_settings = AutomationSettings(is_active=1, category="AI", auto_schedule=1)
        db.add(default_settings)
        db.commit()
    db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
