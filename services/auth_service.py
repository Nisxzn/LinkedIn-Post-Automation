"""
services/auth_service.py
=========================
JWT creation / verification and password hashing utilities.

Uses:
  - passlib[bcrypt] for password hashing (NEVER store plain text)
  - python-jose[cryptography] for HS256 JWT signing
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Any, Optional
from dotenv import load_dotenv

load_dotenv()

from jose import JWTError, jwt
from passlib.context import CryptContext

# ─── Configuration ─────────────────────────────────────────────────────────────
JWT_SECRET: str = os.getenv("JWT_SECRET", "CHANGE_ME_IN_PRODUCTION_USE_LONG_RANDOM_STRING")
JWT_ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24h

# ─── Password hashing ──────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Returns the bcrypt hash of *plain*."""
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Returns True if *plain* matches *hashed* (constant-time comparison)."""
    return pwd_context.verify(plain, hashed)


# ─── JWT ───────────────────────────────────────────────────────────────────────

def create_access_token(subject: Any, extra_claims: Optional[dict] = None) -> str:
    """
    Creates a signed JWT access token.

    Parameters
    ----------
    subject   : User ID (stored as the ``sub`` claim).
    extra_claims : Optional dict of additional JWT claims.

    Returns the encoded JWT string.
    """
    expire = datetime.now(tz=timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(subject), "exp": expire, "iat": datetime.now(tz=timezone.utc)}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes and verifies a JWT.

    Returns the payload dict on success, or None if the token is
    invalid or expired — callers should raise HTTP 401 in that case.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None
