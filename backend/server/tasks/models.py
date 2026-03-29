from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Status(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.medium
    status: Status = Status.todo
    tags: list[str] = []
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    status: Optional[Status] = None
    tags: Optional[list[str]] = None
    due_date: Optional[datetime] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    priority: Priority
    status: Status
    tags: list[str]
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
