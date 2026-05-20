from typing import Any, Optional
from fastapi.responses import JSONResponse
from datetime import datetime, timezone

def api_response(
    success: bool, 
    message: str = "", 
    data: Optional[Any] = None, 
    status_code: int = 200
) -> JSONResponse:
    """Standardized API response format."""
    content = {
        "success": success,
        "message": message,
        "data": data if data is not None else {},
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    return JSONResponse(content=content, status_code=status_code)

def success_response(data: Any = None, message: str = "Request successful") -> JSONResponse:
    return api_response(success=True, message=message, data=data, status_code=200)

def error_response(message: str, status_code: int = 400, data: Any = None) -> JSONResponse:
    return api_response(success=False, message=message, data=data, status_code=status_code)
