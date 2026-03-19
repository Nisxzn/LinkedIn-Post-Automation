"""
routes/auth.py
==============
Real authentication endpoints using bcrypt password hashing and HS256 JWTs.

POST /auth/signup  — create account
POST /auth/login   — authenticate and receive JWT
GET  /auth/me      — return the authenticated user's profile (protected)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database.database import get_db
from database.models import User
from services.auth_service import hash_password, verify_password, create_access_token
from core.dependencies import get_current_user

router = APIRouter()


# ─── Schemas ───────────────────────────────────────────────────────────────────

class SignupSchema(BaseModel):
    name:     str
    email:    EmailStr
    password: str


class LoginSchema(BaseModel):
    email:    EmailStr
    password: str


# ─── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(data: SignupSchema, db: Session = Depends(get_db)):
    """
    Creates a new user account.
    Passwords are hashed with bcrypt before storage.
    """
    # Validate password length
    if len(data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters.",
        )

    # Check for duplicate email
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    hashed_pw = hash_password(data.password)
    user = User(name=data.name, email=data.email, password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Account created successfully. Please sign in."}


@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    """
    Authenticates the user with email + password.
    Returns a signed JWT access token on success.
    """
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(subject=user.id)

    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "id":                 user.id,
            "name":               user.name,
            "email":              user.email,
            "linkedin_connected": user.linkedin_connected,
        },
    }


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    """Returns the profile of the currently authenticated user."""
    return {
        "id":                 current_user.id,
        "name":               current_user.name,
        "email":              current_user.email,
        "linkedin_connected": current_user.linkedin_connected,
        "linkedin_id":        current_user.linkedin_id,
    }
