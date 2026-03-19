"""
langgraph_flow.py
=================
Core LangGraph pipeline for the LinkedIn AI SaaS automation workflow.

Pipeline: START → discover_topics → generate_post → improve_post → schedule_post → END

The publish_post node is intentionally NOT wired into this pipeline because
publishing is triggered by APScheduler at the scheduled time, not immediately.
A separate helper (publish_single_post) handles scheduler-triggered publishing.

Public API
----------
run_langgraph_workflow()     — Full pipeline (discovery → schedule). Called by the scheduler.
publish_single_post(post_id) — Standalone publish called by the scheduler at post time.
build_pipeline()             — Returns the compiled StateGraph (useful for inspection/testing).
"""

from __future__ import annotations

import logging
from typing import Any, TypedDict

from langgraph.graph import StateGraph, END

from automation.nodes.discover_topics import discover_topics_node
from automation.nodes.generate_post import generate_post_node
from automation.nodes.improve_post import improve_post_node
from automation.nodes.schedule_post import schedule_post_node
from automation.nodes.publish_post import publish_post_node

logger = logging.getLogger("langgraph.pipeline")


# ─── Shared state schema ─────────────────────────────────────────────────────

class WorkflowState(TypedDict, total=False):
    """
    Shared state object passed between all nodes in the pipeline.

    Fields populated progressively as the graph executes:
      topics          — list[str]  : raw RSS topic titles
      topic           — str        : the chosen topic for this run
      generated_post  — str        : raw LLM / template output
      improved_post   — str        : refined post ready for scheduling
      post_id         — int        : database ID of the saved Post row
      schedule_time   — datetime   : UTC time at which post will be published
      published       — bool       : True after publish_post_node runs
      publish_time    — datetime   : UTC timestamp of actual publication
    """
    topics: list
    topic: str
    generated_post: str
    improved_post: str
    post_id: int
    schedule_time: Any          # datetime — TypedDict can't import datetime
    published: bool
    publish_time: Any           # datetime


# ─── Graph construction ───────────────────────────────────────────────────────

def build_pipeline() -> Any:
    """
    Builds and compiles the LangGraph StateGraph.

    Graph topology:
        START → discover_topics → generate_post → improve_post → schedule_post → END
    """
    graph = StateGraph(WorkflowState)

    # Register nodes
    graph.add_node("discover_topics", discover_topics_node)
    graph.add_node("generate_post",   generate_post_node)
    graph.add_node("improve_post",    improve_post_node)
    graph.add_node("schedule_post",   schedule_post_node)

    # Wire edges
    graph.set_entry_point("discover_topics")
    graph.add_edge("discover_topics", "generate_post")
    graph.add_edge("generate_post",   "improve_post")
    graph.add_edge("improve_post",    "schedule_post")
    graph.add_edge("schedule_post",   END)

    compiled = graph.compile()
    logger.info("LangGraph pipeline compiled successfully.")
    return compiled


# Singleton — compiled once at module load
_pipeline = build_pipeline()


# ─── Public entry points ──────────────────────────────────────────────────────

def run_langgraph_workflow() -> dict[str, Any]:
    """
    Execute the full automation pipeline:
      discover_topics → generate_post → improve_post → schedule_post

    Returns the final state dict after the graph completes.
    Called by APScheduler and the POST /automation/run endpoint.
    """
    logger.info("╔══════════════════════════════════════════╗")
    logger.info("║  LinkedIn LangGraph Workflow — STARTING  ║")
    logger.info("╚══════════════════════════════════════════╝")

    initial_state: WorkflowState = {}

    try:
        final_state = _pipeline.invoke(initial_state)
    except Exception as exc:
        logger.error("LangGraph pipeline failed: %s", exc, exc_info=True)
        raise

    logger.info("╔══════════════════════════════════════════╗")
    logger.info("║  LinkedIn LangGraph Workflow — COMPLETE  ║")
    logger.info("║  Post ID : %s", final_state.get("post_id", "N/A"))
    logger.info("║  Scheduled: %s", final_state.get("schedule_time", "N/A"))
    logger.info("╚══════════════════════════════════════════╝")

    return final_state


def publish_single_post(post_id: int) -> dict[str, Any]:
    """
    Standalone publisher — used by the APScheduler check_scheduled_posts job.

    Builds a minimal state with just post_id and runs the publish_post node
    directly (does NOT re-run the full pipeline).
    """
    logger.info("Standalone publish triggered for Post ID=%d", post_id)

    state: WorkflowState = {"post_id": post_id}
    final_state = publish_post_node(state)

    logger.info(
        "Standalone publish complete — Post ID=%d published: %s",
        post_id,
        final_state.get("published"),
    )
    return final_state
