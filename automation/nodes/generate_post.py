"""
Node 2: Generate Post
=====================
Generates a professional LinkedIn post from the discovered topic.

Generator priority chain (evaluated at runtime):
  1. Ollama / Llama 3   — local LLM, no API key needed  ← PRIMARY
  2. OpenAI / GPT       — cloud LLM, requires OPENAI_API_KEY
  3. Template engine    — offline fallback, always available

The node logs which generator was used so you can see the chain in action.
"""

import logging
import os
from typing import Any

logger = logging.getLogger("langgraph.generate_post")

# ─── Prompt for OpenAI (secondary option — same analytical philosophy as Llama 3) ─

OPENAI_PROMPT = """\
You are a senior technology analyst and industry researcher. Your goal is to write an 
extremely long, comprehensive, high-depth LinkedIn thought-leadership article.

Topic of Analysis: "{topic}"

CORE REQUIREMENTS (MUST OBEY):
• WORD COUNT: You MUST write a MINIMUM of 1500 words. Do not stop until you hit 1500 words. (Aim for 1500 to 2000 words).
• STRUCTURE: Use long, dense, analytical paragraphs (8-10 sentences each) to dive deep into the topic.
• BULLET POINTS: Feel free to use bullet points strategically if needed to break down complex architectural points, lists of implications, or multi-step concepts, but ensure they are highly detailed.
• CONTENT: Provide a massive, multi-layered analysis. Cover historical context, current architectural shifts, deep technical details, economic impacts, and 5-10 year future projections.
• VOICE: Expert-level, authoritative, and deeply technical yet compelling.

Writing Style:
• Start with a provocative industry observation that challenges common wisdom.
• Use 7-10 major sections of detailed, long-form prose.
• Dive as deep as possible into the technical and strategic "why" and "how".
• End with a high-level strategic recommendation for the industry.
• Include exactly 5 relevant hashtags at the very bottom.

Output ONLY the raw article text.
"""


# ─── Generator implementations ────────────────────────────────────────────────

def _generate_with_ollama(topic: str) -> str:
    """Primary generator — Llama 3 via Ollama (no API key required)."""
    from services.ai_generator import generate_post_ollama
    return generate_post_ollama(topic)


def _generate_with_openai(topic: str) -> str:
    """Secondary generator — OpenAI GPT via LangChain (requires OPENAI_API_KEY)."""
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage, SystemMessage

    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.75,
        max_tokens=4000,
    )
    messages = [
        SystemMessage(content="You are a world-class LinkedIn post writer."),
        HumanMessage(content=OPENAI_PROMPT.format(topic=topic)),
    ]
    response = llm.invoke(messages)
    return response.content.strip()


def _generate_with_template(topic: str) -> str:
    """Fallback generator — offline template engine, never fails."""
    from services.ai_generator import generate_post
    return generate_post(topic)


# ─── LangGraph node ───────────────────────────────────────────────────────────

def generate_post_node(state: dict[str, Any]) -> dict[str, Any]:
    """
    LangGraph node — Generate Post.

    Picks the first topic from the shared state and generates a LinkedIn post
    using the highest-priority available generator.

    State inputs : topics (list[str])
    State outputs: topic (str), generated_post (str)
    """
    logger.info("=== [Node 2] Generate Post — START ===")

    topics: list[str] = state.get("topics", [])
    if not topics:
        raise ValueError("No topics available in state for post generation.")

    topic = topics[0]
    logger.info("Generating post for topic: '%s'", topic)

    generated_post: str = ""
    generator_used: str = ""

    # ── 1. Try Ollama (Llama 3) ───────────────────────────────────────────────
    try:
        generated_post = _generate_with_ollama(topic)
        generator_used = f"Ollama / {os.getenv('OLLAMA_MODEL', 'llama3')}"
        logger.info("[Generator] Ollama succeeded (%d chars).", len(generated_post))
    except Exception as ollama_exc:
        logger.warning(
            "[Generator] Ollama unavailable: %s — trying next option.", ollama_exc
        )

    # ── 2. Try OpenAI (if API key present) ───────────────────────────────────
    if not generated_post and os.getenv("OPENAI_API_KEY"):
        try:
            generated_post = _generate_with_openai(topic)
            generator_used = f"OpenAI / {os.getenv('OPENAI_MODEL', 'gpt-4o-mini')}"
            logger.info("[Generator] OpenAI succeeded (%d chars).", len(generated_post))
        except Exception as openai_exc:
            logger.warning(
                "[Generator] OpenAI failed: %s — falling back to template.", openai_exc
            )

    # ── 3. Fallback: template engine ──────────────────────────────────────────
    if not generated_post:
        generated_post = _generate_with_template(topic)
        generator_used = "template engine (offline)"
        logger.info("[Generator] Template fallback used (%d chars).", len(generated_post))

    logger.info("=== [Node 2] Generate Post — END === (used: %s)", generator_used)

    return {**state, "topic": topic, "generated_post": generated_post}
