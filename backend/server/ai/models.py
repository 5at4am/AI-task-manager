from pydantic import BaseModel
from typing import Optional
from enum import Enum


class AIProvider(str, Enum):
    groq = "groq"
    openai = "openai"


class SuggestRequest(BaseModel):
    title: str
    description: Optional[str] = None
    tags: list[str] = []
    provider: AIProvider = AIProvider.groq


class SummarizeRequest(BaseModel):
    task_ids: Optional[list[str]] = None
    provider: AIProvider = AIProvider.groq


class PrioritizeRequest(BaseModel):
    task_ids: Optional[list[str]] = None
    provider: AIProvider = AIProvider.groq


class BreakdownRequest(BaseModel):
    title: str
    description: Optional[str] = None
    provider: AIProvider = AIProvider.groq


class BreakdownStep(BaseModel):
    step: int
    title: str
    details: str


class BreakdownResponse(BaseModel):
    task_title: str
    steps: list[BreakdownStep]
    provider: str


class PrioritizedTask(BaseModel):
    rank: int
    id: str
    title: str
    urgency: str       # HIGH / MEDIUM / LOW
    reasoning: str


class PrioritizeResponse(BaseModel):
    tasks: list[PrioritizedTask]
    provider: str


class AIResponse(BaseModel):
    result: str
    provider: str
