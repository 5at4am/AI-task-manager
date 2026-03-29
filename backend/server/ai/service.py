import os
from langchain_core.language_models import BaseChatModel
from langchain_core.output_parsers import StrOutputParser
from .models import AIProvider
from .prompt_builder import build_suggestion_prompt, build_summarize_prompt


# ── LLM factory ──────────────────────────────────────────────────────────────

def get_llm(provider: AIProvider) -> BaseChatModel:
    if provider == AIProvider.gemini:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=os.getenv("GEMINI_API_KEY"),
        )
    if provider == AIProvider.openai:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model="gpt-4o-mini",
            api_key=os.getenv("OPENAI_API_KEY"),
        )
    if provider == AIProvider.groq:
        from langchain_groq import ChatGroq
        return ChatGroq(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            api_key=os.getenv("GROQ_API_KEY"),
        )
    raise ValueError(f"Unknown provider: {provider}")


# ── Chains ────────────────────────────────────────────────────────────────────

async def run_suggestion(provider: AIProvider, title: str, description: str | None, tags: list[str]) -> str:
    llm = get_llm(provider)
    chain = build_suggestion_prompt() | llm | StrOutputParser()
    return await chain.ainvoke({
        "title": title,
        "description": description or "N/A",
        "tags": ", ".join(tags) if tags else "none",
    })


async def run_summarize(provider: AIProvider, tasks: list[dict]) -> str:
    llm = get_llm(provider)
    chain = build_summarize_prompt() | llm | StrOutputParser()

    task_lines = []
    for t in tasks:
        line = f"- [{t['status']}] {t['title']} (priority: {t['priority']})"
        if t.get("tags"):
            line += f" | tags: {', '.join(t['tags'])}"
        if t.get("due_date"):
            line += f" | due: {t['due_date']}"
        task_lines.append(line)

    return await chain.ainvoke({"task_list": "\n".join(task_lines)})
