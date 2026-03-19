"""
services/ai_generator.py
========================
LinkedIn post generation service.

Priority chain (evaluated at call-time):
  1. Ollama local LLM  (llama3 — no API key required, primary)
  2. Template engine   (fully offline fallback)

Ollama output is returned raw — no post-processing or template assembly
is applied, so every post has a naturally unique structure.
"""

import logging
import random
import re

import requests

logger = logging.getLogger("services.ai_generator")

# ─── Ollama configuration ─────────────────────────────────────────────────────

OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL    = "llama3"
OLLAMA_TIMEOUT  = 600   # Increased to 10 mins - local LLMs need time to generate 1500+ words

# ─── Prompt template for Llama 3 ─────────────────────────────────────────────
# Designed to produce organic, structurally varied posts on every run.
# Key techniques:
#   • Explicitly forbids fixed templates and repeated structures
#   • Lists several *different* opening styles so the model varies them
#   • Leaves paragraph count, bullet usage, and tone variation to the model
#   • High temperature (0.9) in the API call further increases diversity

LLAMA_PROMPT = """\
You are a senior technology analyst and industry researcher. Your goal is to write an 
extremely long, comprehensive, high-depth LinkedIn thought-leadership article.

Topic of Analysis: "{topic}"

CORE REQUIREMENTS (MUST OBEY):
• WORD COUNT: You MUST write a MINIMUM of 3000 words. Do not stop until you hit 3000 words. (Aim for 3000 to 4000 words).
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


# ─── Ollama helpers ───────────────────────────────────────────────────────────

def is_ollama_available() -> bool:
    """
    Quick health-check against the Ollama REST API.
    Returns True if the server responds within 3 seconds.
    """
    try:
        resp = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=3)
        return resp.status_code == 200
    except requests.exceptions.ConnectionError:
        return False
    except Exception:
        return False


def generate_post_ollama(topic: str) -> str:
    """
    Calls the Ollama local API to generate a LinkedIn post using Llama 3.

    Raises:
        RuntimeError  — if Ollama is unreachable or returns an error.
        ValueError    — if the response body is empty or missing.
    """
    if not is_ollama_available():
        raise RuntimeError(
            "Ollama server is not available. "
            "Start it with:  ollama run llama3"
        )

    prompt = LLAMA_PROMPT.format(topic=topic)

    payload = {
        "model":  OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.9,
            "top_p": 0.95,
            # Boosted to allow for ~1500-2000 word generation
            "num_predict": 4000,
            "top_k": 40,
        },
    }

    logger.info("Sending request to Ollama (model=%s) …", OLLAMA_MODEL)

    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=OLLAMA_TIMEOUT,
        )
        response.raise_for_status()
    except requests.exceptions.ConnectionError as exc:
        raise RuntimeError(
            f"Cannot connect to Ollama at {OLLAMA_BASE_URL}. "
            "Make sure Ollama is running: ollama run llama3"
        ) from exc
    except requests.exceptions.Timeout as exc:
        raise RuntimeError(
            f"Ollama request timed out after {OLLAMA_TIMEOUT}s. "
            "The model might still be loading — try again shortly."
        ) from exc
    except requests.exceptions.HTTPError as exc:
        raise RuntimeError(f"Ollama returned HTTP {response.status_code}: {response.text}") from exc

    data = response.json()
    generated_text = data.get("response", "").strip()

    if not generated_text:
        raise ValueError("Ollama returned an empty response.")

    logger.info("Ollama generation complete (%d chars).", len(generated_text))
    return generated_text


# ─── Template-based generator (offline fallback) ──────────────────────────────

def clean_text(text):
    """Ensures correct casing, spacing, and punctuation."""
    text = re.sub(r' +', ' ', text).strip()
    if text and text[0].islower():
        text = text[0].upper() + text[1:]
    if text and text[-1] not in '.?!#':
        text += '.'
    return text


def format_topic(topic):
    """Cleans up the topic string for natural flow."""
    if not topic:
        return "this technology"
    topic = re.split(r' - | \| ', topic)[0]
    return topic.strip()


def apply_smart_case(topic):
    """Preserves acronyms and capitalises properly."""
    acronyms = ['AI', 'SAAS', 'API', 'IT', 'ML', 'UX', 'UI', 'SDK', 'IOT', 'LLM', 'GPT']
    words = topic.split()
    processed = []
    for word in words:
        clean_word = re.sub(r'[^\w]', '', word).upper()
        processed.append(word.upper() if clean_word in acronyms else word.lower())
    return " ".join(processed)


def animate_case(text):
    """Ensures the first letter is capitalised."""
    if not text:
        return text
    return text[0].upper() + text[1:]


def generate_post(topic: str) -> str:
    """
    CRITICAL FALLBACK (Only used if LLM nodes are both DOWN).
    
    The old 'Why is everyone...' templates have been DELETED. 
    This fallback now produces a raw, non-templated technical observation.
    """
    raw_topic = format_topic(topic)
    
    phrases = [
        f"The technical implications of {raw_topic} are often underestimated in the current discourse. Beyond the immediate metrics, we are seeing a shift in underlying architectural paradigms that will redefine engineering standards for the next decade.",
        f"Analyzing {raw_topic} requires a move away from surface-level hype and toward a genuine understanding of system interoperability. The friction between legacy structures and these new models is where the real innovation—and risk—lies.",
        f"Regarding {raw_topic}: the most successful founders and engineers right now aren't just implementing features; they are rethinking the entire data-sovereignty and scalability landscape from first principles."
    ]
    
    body = random.choice(phrases)
    tags = "#Technology #Architecture #Innovation #Engineering #Strategy"
    
    return f"{body}\n\n{tags}"
