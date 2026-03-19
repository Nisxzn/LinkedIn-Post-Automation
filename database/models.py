
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"
    id                    = Column(Integer, primary_key=True, index=True)
    name                  = Column(String, nullable=False)
    email                 = Column(String, unique=True, nullable=False)
    password              = Column(String, nullable=False)       # bcrypt hash

    # LinkedIn OAuth fields
    linkedin_id           = Column(String, nullable=True)        # LinkedIn sub / URN
    linkedin_access_token = Column(Text,   nullable=True)        # OAuth access token
    linkedin_refresh_token= Column(Text,   nullable=True)        # OAuth refresh token (if issued)
    linkedin_connected    = Column(Boolean, default=False)       # quick connected flag


class Post(Base):
    __tablename__ = "posts"
    id           = Column(Integer, primary_key=True)
    user_id      = Column(Integer, ForeignKey("users.id"))
    content      = Column(Text)
    status       = Column(String, default="draft")
    linkedin_urn = Column(String, nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)


class ScheduledPost(Base):
    __tablename__ = "scheduled_posts"
    id            = Column(Integer, primary_key=True)
    post_id       = Column(Integer, ForeignKey("posts.id"))
    schedule_time = Column(DateTime)
    status        = Column(String, default="pending")


class Analytics(Base):
    __tablename__ = "analytics"
    id       = Column(Integer, primary_key=True)
    post_id  = Column(Integer)
    views    = Column(Integer, default=0)
    likes    = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares   = Column(Integer, default=0)


class AutomationSettings(Base):
    __tablename__ = "automation_settings"
    id            = Column(Integer, primary_key=True)
    user_id       = Column(Integer, default=1)
    is_active     = Column(Integer, default=1)    # 1 = ON, 0 = OFF
    category      = Column(String,  default="AI")
    auto_schedule = Column(Integer, default=1)
