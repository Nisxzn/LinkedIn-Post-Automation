from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from utils.logger import logger
import time

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Professional request logging middleware that captures 
    method, path, status code, and duration.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Suppress favicon logs as requested
        if request.url.path == "/favicon.ico":
            return await call_next(request)

        response = await call_next(request)
        
        process_time = (time.time() - start_time) * 1000
        status_code = response.status_code
        
        # Colored status logging logic
        if status_code >= 500:
            status_msg = f"ERROR {status_code}"
        elif status_code >= 400:
            status_msg = f"WARN  {status_code}"
        else:
            status_msg = f"OK    {status_code}"

        logger.info(
            f"{request.method} {request.url.path} — {status_msg} ({process_time:.2f}ms)"
        )
        
        return response
