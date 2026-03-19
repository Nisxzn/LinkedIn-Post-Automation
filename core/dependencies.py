"""
core/dependencies.py
====================
FastAPI dependency that validates JWT Bearer tokens and returns
the authenticated User from the database.

Usage in any protected router:

    from core.dependencies import get_current_user
    from database.models import User

    @router.get("/me")
    def me(current_user: User = Depends(get_current_user)):
        return {"email": current_user.email}
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import User
from services.auth_service import decode_access_token

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Validates the JWT Bearer token in the `Authorization` header and
    returns the authenticated User ORM object.

    Raises HTTP 401 if the token is missing, expired, or invalid.
    Raises HTTP 404 if the user_id embedded in the token no longer exists.
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: int = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is malformed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
