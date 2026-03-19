"""
Node 3: Improve Post
====================
Lightly polishes the generated post for clarity and readability
without imposing any structural template.

The critical principle here is: preserve the organic style.
If the generation node produced a narrative post, keep it as a narrative.
If it produced bullet points naturally, keep the bullets.
Do NOT force a fixed structure onto the output.

Improver priority chain:
  1. Ollama / Llama 3   — local LLM, no API key needed  ← PRIMARY
  2. OpenAI / GPT       — cloud LLM, requires OPENAI_API_KEY
  3. Local text pass    — minimal regex cleanup, always available
"""

import logging
import os
import re
from typing import Any

logger = logging.getLogger("langgraph.improve_post")

# ─── Prompt: shared core, used for both Ollama and OpenAI ────────────────────

IMPROVEMENT_PROMPT = """\
Below is a massive, long-form LinkedIn post draft. Your job is light editorial polishing only.

--- DRAFT ---
{draft}
--- END DRAFT ---

Editing rules:
1. Fix any grammatical errors or awkward phrasing.
2. If a sentence is unclear, rewrite it for clarity — but keep the same meaning.
3. PRESERVE the post's natural structure and voice.
4. Do NOT rewrite the entire post or change its format.
5. Do NOT add section headings, labels, or boilerplate phrases.
6. Ensure hashtags appear on the very last line only.
7. CRUCIAL: Do NOT shorten the post. It is supposed to be a massive 1500+ word article. Maintain the exact same length and depth.
8. Output ONLY the polished post text — no commentary, no explanation.
"""


# ─── Improver implementations ─────────────────────────────────────────────────

def _improve_with_ollama(draft: str) -> str:
    """Primary improver — Llama 3 via Ollama (no API key required)."""
    import requests

    ollama_base = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    model       = os.getenv("OLLAMA_MODEL", "llama3")

    payload = {
        "model":  model,
        "prompt": IMPROVEMENT_PROMPT.format(draft=draft),
        "stream": False,
        "options": {
            # Lower temp = light editorial touch, not a structural rewrite
            "temperature": 0.45,
            # MASSIVE limit to ensure we do not truncate the 1500+ word post
            "num_predict": 4000,
        },
    }

    response = requests.post(
        f"{ollama_base}/api/generate",
        json=payload,
        timeout=600,
    )
    response.raise_for_status()
    text = response.json().get("response", "").strip()
    if not text:
        raise ValueError("Ollama returned an empty response during improvement pass.")
    return text


def _improve_with_openai(draft: str) -> str:
    """Secondary improver — OpenAI GPT via LangChain."""
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage, SystemMessage

    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.35,
        max_tokens=4000,
    )
    messages = [
        SystemMessage(content=(
            "You are an expert LinkedIn editor who specialises in "
            "professional, high-engagement posts."
        )),
        HumanMessage(content=IMPROVEMENT_PROMPT.format(draft=draft)),
    ]
    response = llm.invoke(messages)
    return response.content.strip()


def _local_improve(text: str) -> str:
    """
    Lightweight local cleanup (no LLM required):
    - Normalises line endings.
    - Converts Markdown `- ` bullets → LinkedIn `• ` bullets.
    - Collapses excess blank lines.
    """
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"^- ", "• ", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# ─── LangGraph node ───────────────────────────────────────────────────────────

def improve_post_node(state: dict[str, Any]) -> dict[str, Any]:
    """
    LangGraph node — Improve Post.

    Takes generated_post from the state and runs a refinement pass using the
    highest-priority available improver.

    State inputs : generated_post (str)
    State outputs: improved_post (str)
    """
    logger.info("=== [Node 3] Improve Post — START ===")

    generated_post: str = state.get("generated_post", "")
    if not generated_post:
        raise ValueError("No generated_post in state to improve.")

    improved_post: str = ""
    improver_used: str = ""

    # ── 1. Try Ollama ────────────────────────────────────────────────────────
    try:
        improved_post = _improve_with_ollama(generated_post)
        improver_used = f"Ollama / {os.getenv('OLLAMA_MODEL', 'llama3')}"
        logger.info(
            "[Improver] Ollama succeeded (%d → %d chars).",
            len(generated_post), len(improved_post),
        )
    except Exception as ollama_exc:
        logger.warning(
            "[Improver] Ollama unavailable: %s — trying next option.", ollama_exc
        )

    # ── 2. Try OpenAI ────────────────────────────────────────────────────────
    if not improved_post and os.getenv("OPENAI_API_KEY"):
        try:
            improved_post = _improve_with_openai(generated_post)
            improver_used = f"OpenAI / {os.getenv('OPENAI_MODEL', 'gpt-4o-mini')}"
            logger.info(
                "[Improver] OpenAI succeeded (%d → %d chars).",
                len(generated_post), len(improved_post),
            )
        except Exception as openai_exc:
            logger.warning(
                "[Improver] OpenAI failed: %s — falling back to local pass.", openai_exc
            )

    # ── 3. Fallback: local text cleanup ──────────────────────────────────────
    if not improved_post:
        improved_post = _local_improve(generated_post)
        improver_used = "local text cleanup (offline)"
        logger.info(
            "[Improver] Local pass applied (%d chars).", len(improved_post)
        )

    logger.info("=== [Node 3] Improve Post — END === (used: %s)", improver_used)

    return {**state, "improved_post": improved_post}
