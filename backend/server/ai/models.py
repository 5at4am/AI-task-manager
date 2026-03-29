from pydantic import BaseModel
from typing import Optional
from enum import Enum


class AIProvider(str, Enum):
    gemini = "gemini"
    openai = "openai"
    groq = "groq"


class SuggestRequest(BaseModel):
    title: str
    description: Optional[str] = None
    tags: list[str] = []
    provider: AIProvider = AIProvider.gemini


class SummarizeRequest(BaseModel):
    task_ids: Optional[list[str]] = None  # None means summarize all tasks
    provider: AIProvider = AIProvider.gemini


class AIResponse(BaseModel):
    result: str
    provider: str
