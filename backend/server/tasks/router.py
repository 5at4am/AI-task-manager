from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from .models import TaskCreate, TaskUpdate, TaskResponse, Priority, Status
from . import store

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(body: TaskCreate):
    return store.create_task(body.model_dump())


@router.get("/", response_model=list[TaskResponse])
def list_tasks(
    status: Optional[Status] = Query(None, description="Filter by status"),
    priority: Optional[Priority] = Query(None, description="Filter by priority"),
    tags: Optional[list[str]] = Query(None, description="Filter by tags"),
    sort_by: str = Query("created_at", description="Field to sort by"),
    order: str = Query("desc", description="Sort order: asc or desc"),
):
    return store.list_tasks(
        status=status.value if status else None,
        priority=priority.value if priority else None,
        tags=tags,
        sort_by=sort_by,
        order=order,
    )


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: str):
    task = store.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, body: TaskUpdate):
    task = store.update_task(task_id, body.model_dump(exclude_unset=True))
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str):
    if not store.delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found")
