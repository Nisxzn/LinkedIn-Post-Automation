"""
main.py
=======
Production-ready entry point for the LinkedIn AI Automation platform.

Features:
  - Professional structured API routing under /api namespace
  - Centralized error handling (no ugly 404s or 500s)
  - Request logging middleware with colored output
  - Security headers (helmet-equivalent for Python)
  - Rate limiting via SlowAPI
  - CORS configured for Railway & local dev
  - Graceful startup/shutdown lifecycle
  - Health monitoring at /health
  - Environment validation on boot
"""

from dotenv import load_dotenv
load_dotenv()

import os
import signal
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, Response
from starlette.exceptions import HTTPException as StarletteHTTPException

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# ─── Internal imports ─────────────────────────────────────────────────────────
from utils.logger import logger
from middleware.security import RequestLoggingMiddleware
from middleware.error_handler import global_exception_handler, not_found_handler
from database.database import init_db
from scheduler.jobs import start_scheduler

from routes import auth, posts, scheduler_routes, analytics, automation_routes
from routes import linkedin
from routes.health import router as health_router


# ─── App metadata ─────────────────────────────────────────────────────────────
APP_NAME = "LinkedIn AI Automation"
APP_VERSION = "3.1.0"
ENVIRONMENT = os.getenv("ENVIRONMENT", "production")
PORT = int(os.getenv("PORT", 8000))


# ─── Lifespan (startup + shutdown) ────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles application startup and graceful shutdown."""
    logger.info("╔══════════════════════════════════════════════════════════╗")
    logger.info("║   LinkedIn AI Automation — Starting up ...              ║")
    logger.info("╚══════════════════════════════════════════════════════════╝")

    # Validate critical environment variables
    _validate_environment()

    # Initialize database
    logger.info("Initializing database ...")
    init_db()
    logger.info("Database ready ✓")

    # Start background scheduler
    logger.info("Starting APScheduler ...")
    start_scheduler()
    logger.info("Scheduler ready ✓")

    logger.info("╔══════════════════════════════════════════════════════════╗")
    logger.info("║   ✅  Backend ready — %s (%s)", APP_VERSION, ENVIRONMENT)
    logger.info("║   🌐  Listening on port %d", PORT)
    logger.info("╚══════════════════════════════════════════════════════════╝")

    yield  # Application is running

    # Graceful shutdown
    logger.info("╔══════════════════════════════════════════════════════════╗")
    logger.info("║   LinkedIn AI Automation — Shutting down gracefully ... ║")
    logger.info("╚══════════════════════════════════════════════════════════╝")


# ─── FastAPI app ──────────────────────────────────────────────────────────────

app = FastAPI(
    title=APP_NAME,
    description="Production-grade FastAPI + LangGraph powered LinkedIn content automation platform.",
    version=APP_VERSION,
    docs_url="/docs" if ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)


# ─── Rate Limiter ─────────────────────────────────────────────────────────────

limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


# ─── Security Headers Middleware (helmet-equivalent) ──────────────────────────

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Adds security headers to every response (equivalent to helmet.js)."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["X-Powered-By"] = APP_NAME
    return response


# ─── Request Logging Middleware ───────────────────────────────────────────────

app.add_middleware(RequestLoggingMiddleware)


# ─── CORS ─────────────────────────────────────────────────────────────────────

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

# Add production frontend URL if set
FRONTEND_URL = os.getenv("FRONTEND_URL")
if FRONTEND_URL:
    ALLOWED_ORIGINS.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)


# ─── Trusted Host (proxy support for Railway) ────────────────────────────────

if ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"],  # Railway handles host validation at the proxy layer
    )


# ─── Exception Handlers ──────────────────────────────────────────────────────

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handles all HTTP exceptions with structured JSON responses."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "data": {},
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return await global_exception_handler(request, exc)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={
            "success": False,
            "message": "Rate limit exceeded. Please slow down.",
            "data": {"retry_after": str(exc.detail)},
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


# ─── Root Route ───────────────────────────────────────────────────────────────

@app.get("/", tags=["System"])
def root():
    """Professional root endpoint — confirms the service is live."""
    return {
        "success": True,
        "service": APP_NAME,
        "version": APP_VERSION,
        "status": "running",
        "environment": ENVIRONMENT,
        "endpoints": {
            "health": "/health",
            "docs": "/docs" if ENVIRONMENT != "production" else "disabled in production",
            "api": {
                "auth": "/api/auth",
                "linkedin": "/api/linkedin",
                "posts": "/api/posts",
                "schedule": "/api/schedule",
                "analytics": "/api/analytics",
                "automation": "/api/automation",
            },
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ─── Favicon handler (prevent 404 noise) ─────────────────────────────────────

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)


# ─── API Routers (under /api namespace) ──────────────────────────────────────
# All existing routes preserved — just moved under /api prefix for clean structure

app.include_router(health_router,                prefix="/health",          tags=["System"])
app.include_router(auth.router,                  prefix="/api/auth",        tags=["Auth"])
app.include_router(linkedin.router,              prefix="/api/linkedin",    tags=["LinkedIn"])
app.include_router(posts.router,                 prefix="/api/posts",       tags=["Posts"])
app.include_router(scheduler_routes.router,      prefix="/api/schedule",    tags=["Scheduler"])
app.include_router(analytics.router,             prefix="/api/analytics",   tags=["Analytics"])
app.include_router(automation_routes.router,     prefix="/api/automation",  tags=["Automation"])

# ── Backward compatibility: keep old routes alive to avoid breaking frontend ──
app.include_router(auth.router,                  prefix="/auth",            tags=["Auth (Legacy)"],       include_in_schema=False)
app.include_router(linkedin.router,              prefix="/linkedin",        tags=["LinkedIn (Legacy)"],   include_in_schema=False)
app.include_router(posts.router,                 prefix="/posts",           tags=["Posts (Legacy)"],      include_in_schema=False)
app.include_router(scheduler_routes.router,      prefix="/schedule",        tags=["Scheduler (Legacy)"],  include_in_schema=False)
app.include_router(analytics.router,             prefix="/analytics",       tags=["Analytics (Legacy)"],  include_in_schema=False)
app.include_router(automation_routes.router,     prefix="/automation",      tags=["Automation (Legacy)"], include_in_schema=False)


# ─── Environment Validation ──────────────────────────────────────────────────

def _validate_environment():
    """Checks that all critical environment variables exist at startup."""
    required_vars = [
        "JWT_SECRET",
        "LINKEDIN_CLIENT_ID",
        "LINKEDIN_CLIENT_SECRET",
        "LINKEDIN_REDIRECT_URI",
    ]

    missing = [var for var in required_vars if not os.getenv(var)]

    if missing:
        logger.critical(
            "FATAL: Missing required environment variables: %s",
            ", ".join(missing),
        )
        logger.critical("Server cannot start without these. Check your .env file.")
        raise SystemExit(1)

    logger.info("Environment validation passed ✓ (%d vars checked)", len(required_vars))


# ─── Uvicorn Entry Point ─────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=ENVIRONMENT != "production",
        log_level="info",
        access_log=False,  # We handle logging via our middleware
        proxy_headers=True,  # Trust Railway's proxy headers
        forwarded_allow_ips="*",
    )
