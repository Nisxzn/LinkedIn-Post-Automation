"""
routes/health.py
================
System health and monitoring endpoints.
Provides real-time server metrics for deployment dashboards and uptime monitors.
"""

import os
import time
import psutil
from datetime import datetime, timezone
from fastapi import APIRouter

router = APIRouter()

# Captured at module import time (server start)
_start_time = time.time()


@router.get("/")
def health_check():
    """
    Comprehensive health check endpoint.
    Returns server uptime, memory usage, CPU, and Python version.
    """
    process = psutil.Process(os.getpid())
    mem_info = process.memory_info()
    uptime_seconds = time.time() - _start_time

    # Format uptime into human-readable
    days, remainder = divmod(int(uptime_seconds), 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)
    uptime_str = f"{days}d {hours}h {minutes}m {seconds}s"

    return {
        "success": True,
        "status": "healthy",
        "uptime": uptime_str,
        "uptime_seconds": round(uptime_seconds, 2),
        "system": {
            "cpu_percent": psutil.cpu_percent(interval=0.1),
            "memory_used_mb": round(mem_info.rss / (1024 * 1024), 2),
            "memory_percent": round(process.memory_percent(), 2),
            "pid": os.getpid(),
        },
        "environment": os.getenv("ENVIRONMENT", "production"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
