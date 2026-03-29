# In-memory task store
import uuid
from datetime import datetime
from typing import Optional, List

tasks = {}


def create_task(task_data: dict) -> dict:
    task_id = str(uuid.uuid4())
    now = datetime.utcnow()
    task = {
        "id": task_id,
        "title": task_data["title"],
        "description": task_data.get("description"),
        "priority": task_data.get("priority", "medium"),
        "status": task_data.get("status", "todo"),
        "tags": task_data.get("tags", []),
        "due_date": task_data.get("due_date"),
        "created_at": now,
        "updated_at": now,
    }
    tasks[task_id] = task
    return task


def get_task(task_id: str) -> Optional[dict]:
    return tasks.get(task_id)


def list_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    tags: Optional[List[str]] = None,
    sort_by: str = "created_at",
    order: str = "desc",
) -> List[dict]:
    result = list(tasks.values())

    # Filter
    if status:
        result = [t for t in result if t["status"] == status]
    if priority:
        result = [t for t in result if t["priority"] == priority]
    if tags:
        result = [t for t in result if any(tag in t.get("tags", []) for tag in tags)]

    # Sort
    reverse = order == "desc"
    result.sort(key=lambda x: x.get(sort_by, ""), reverse=reverse)

    return result


def update_task(task_id: str, updates: dict) -> Optional[dict]:
    if task_id not in tasks:
        return None
    task = tasks[task_id]
    for key, value in updates.items():
        if value is not None:
            task[key] = value
    task["updated_at"] = datetime.utcnow()
    return task


def delete_task(task_id: str) -> bool:
    if task_id in tasks:
        del tasks[task_id]
        return True
    return False
