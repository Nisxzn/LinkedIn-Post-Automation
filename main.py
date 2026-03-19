from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, posts, scheduler_routes, analytics, automation_routes
from routes import linkedin
from database.database import init_db
from scheduler.jobs import start_scheduler
import logging

# ─── Logging setup ────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("main")

# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI LinkedIn Automation Backend",
    description="FastAPI + LangGraph powered LinkedIn content automation SaaS.",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    logger.info("Initialising database …")
    init_db()
    logger.info("Starting APScheduler …")
    start_scheduler()
    logger.info("Backend ready ✓")

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router,               prefix="/auth",       tags=["Auth"])
app.include_router(linkedin.router,           prefix="/linkedin",   tags=["LinkedIn"])
app.include_router(posts.router,              prefix="/posts",      tags=["Posts"])
app.include_router(scheduler_routes.router,   prefix="/schedule",   tags=["Scheduler"])
app.include_router(analytics.router,          prefix="/analytics",  tags=["Analytics"])
app.include_router(automation_routes.router,  prefix="/automation", tags=["Automation"])

@app.get("/health")
def health():
    return {"status": "ok", "version": "3.0.0"}
