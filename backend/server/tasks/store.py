from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4
from sqlalchemy.orm import Session
from server.database import TaskModel
from .models import TaskCreate, TaskUpdate, Priority, Status


def _now() -> datetime:
    return datetime.now(timezone.utc)


def create_task(db: Session, user_email: str, data: TaskCreate) -> TaskModel:
    task = TaskModel(
        id=str(uuid4()),
        user_email=user_email,
        **data.model_dump(),
        created_at=_now(),
        updated_at=_now(),
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task(db: Session, task_id: str, user_email: str) -> Optional[TaskModel]:
    return db.query(TaskModel).filter(
        TaskModel.id == task_id,
        TaskModel.user_email == user_email
    ).first()


def list_tasks(
    db: Session,
    user_email: str,
    status: Optional[Status] = None,
    priority: Optional[Priority] = None,
    tags: Optional[list[str]] = None,
    sort_by: str = "created_at",
    order: str = "desc",
) -> list[TaskModel]:
    query = db.query(TaskModel).filter(TaskModel.user_email == user_email)

    if status:
        query = query.filter(TaskModel.status == status)
    if priority:
        query = query.filter(TaskModel.priority == priority)

    results = query.all()

    if tags:
        results = [t for t in results if any(tag in (t.tags or []) for tag in tags)]

    valid_sort_fields = {"created_at", "updated_at", "priority", "status", "title"}
    if sort_by in valid_sort_fields:
        reverse = order == "desc"
        results.sort(key=lambda t: (getattr(t, sort_by) is None, getattr(t, sort_by)), reverse=reverse)

    return results


def update_task(db: Session, task_id: str, user_email: str, data: TaskUpdate) -> Optional[TaskModel]:
    task = get_task(db, task_id, user_email)
    if not task:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)
    task.updated_at = _now()
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: str, user_email: str) -> bool:
    task = get_task(db, task_id, user_email)
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True
