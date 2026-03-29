import os
import re
from langchain_core.language_models import BaseChatModel
from langchain_core.output_parsers import StrOutputParser
from .models import AIProvider
from .prompt_builder import build_suggestion_prompt, build_summarize_prompt, build_prioritize_prompt, build_breakdown_prompt


def get_llm(provider: AIProvider) -> BaseChatModel:
    if provider == AIProvider.openai:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
    from langchain_groq import ChatGroq
    return ChatGroq(model="llama-3.1-8b-instant", api_key=os.getenv("GROQ_API_KEY"))


def _fmt_tasks(tasks: list[dict]) -> str:
    lines = []
    for i, t in enumerate(tasks, 1):
        line = f"{i}. [{t['status']}] {t['title']} (priority: {t['priority']})"
        if t.get("tags"):
            line += f" | tags: {', '.join(t['tags'])}"
        if t.get("due_date"):
            line += f" | due: {t['due_date']}"
        lines.append(line)
    return "\n".join(lines)


async def run_suggestion(provider: AIProvider, title: str, description: str | None, tags: list[str]) -> str:
    chain = build_suggestion_prompt() | get_llm(provider) | StrOutputParser()
    return await chain.ainvoke({
        "title": title,
        "description": description or "N/A",
        "tags": ", ".join(tags) if tags else "none",
    })


async def run_summarize(provider: AIProvider, tasks: list[dict]) -> str:
    chain = build_summarize_prompt() | get_llm(provider) | StrOutputParser()
    return await chain.ainvoke({"task_list": _fmt_tasks(tasks)})


async def run_prioritize(provider: AIProvider, tasks: list[dict]) -> list[dict]:
    chain = build_prioritize_prompt() | get_llm(provider) | StrOutputParser()
    raw = await chain.ainvoke({
        "task_list": _fmt_tasks(tasks),
        "count": len(tasks),
    })

    # strict lookup — only accept titles that match an actual task
    title_map = {t["title"].lower(): t for t in tasks}

    results = []
    for line in raw.strip().splitlines():
        line = line.strip()
        if not line:
            continue
        m = re.match(
            r"(\d+)\.\s+\[URGENCY:\s*(HIGH|MEDIUM|LOW)\]\s+(.+?)\s+--\s+(.+)",
            line, re.IGNORECASE
        )
        if not m:
            continue
        rank, urgency, title, reasoning = int(m.group(1)), m.group(2).upper(), m.group(3).strip(), m.group(4).strip()

        # exact match first, then partial — if nothing matches, skip the line entirely
        matched = title_map.get(title.lower()) or next(
            (t for t in tasks if title.lower() in t["title"].lower() or t["title"].lower() in title.lower()), None
        )
        if not matched:
            continue  # drop hallucinated tasks

        # avoid duplicates
        if any(r["id"] == matched["id"] for r in results):
            continue

        results.append({
            "rank": rank,
            "id": matched["id"],
            "title": matched["title"],
            "urgency": urgency,
            "reasoning": reasoning,
        })

    # re-number ranks cleanly in case of gaps
    for i, r in enumerate(results, 1):
        r["rank"] = i

    return results


async def run_breakdown(provider: AIProvider, title: str, description: str | None) -> list[dict]:
    chain = build_breakdown_prompt() | get_llm(provider) | StrOutputParser()
    raw = await chain.ainvoke({
        "title": title,
        "description": description or "N/A",
    })

    steps = []
    for line in raw.strip().splitlines():
        line = line.strip()
        if not line:
            continue
        # match: "1. Set up database schema :: Create the users and tasks tables with proper indexes."
        m = re.match(r"(\d+)\.\s+(.+?)\s*::\s*(.+)", line)
        if not m:
            continue
        steps.append({
            "step": int(m.group(1)),
            "title": m.group(2).strip(),
            "details": m.group(3).strip(),
        })

    # re-number in case of gaps
    for i, s in enumerate(steps, 1):
        s["step"] = i

    return steps
