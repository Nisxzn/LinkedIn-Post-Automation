from fastapi import Request, status
from fastapi.responses import JSONResponse
from utils.responses import error_response
from utils.logger import logger
import traceback

async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler that prevents server crashes and 
    returns professional JSON responses for any unhandled error.
    """
    logger.error(f"Unhandled Exception: {request.method} {request.url}")
    logger.error(traceback.format_exc())
    
    return error_response(
        message="An internal server error occurred. Our engineering team has been notified.",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )

async def not_found_handler(request: Request, exc: Exception):
    """Handles 404 errors with a professional JSON response."""
    return error_response(
        message=f"The requested resource '{request.url.path}' was not found.",
        status_code=status.HTTP_404_NOT_FOUND
    )
