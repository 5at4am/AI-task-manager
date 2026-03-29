from fastapi import APIRouter, HTTPException, Query, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from sqlalchemy.orm import Session
from .models import TaskCreate, TaskUpdate, TaskResponse, Priority, Status
from server.database import get_db
from server.auth.utils import decode_token
from . import store

router = APIRouter(prefix="/tasks", tags=["Tasks"])
bearer = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> str:
    payload = decode_token(credentials.credentials)
    email = payload.get("sub") if payload else None
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return email


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(body: TaskCreate, db: Session = Depends(get_db),
                user_email: str = Depends(get_current_user)):
    return store.create_task(db, user_email, body)


@router.get("/", response_model=list[TaskResponse])
def list_tasks(
    status: Optional[Status] = Query(None),
    priority: Optional[Priority] = Query(None),
    tags: Optional[list[str]] = Query(None),
    sort_by: str = Query("created_at"),
    order: str = Query("desc"),
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user),
):
    return store.list_tasks(db, user_email, status=status, priority=priority,
                            tags=tags, sort_by=sort_by, order=order)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, db: Session = Depends(get_db),
             user_email: str = Depends(get_current_user)):
    task = store.get_task(db, task_id, user_email)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, body: TaskUpdate, db: Session = Depends(get_db),
                user_email: str = Depends(get_current_user)):
    task = store.update_task(db, task_id, user_email, body)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: Session = Depends(get_db),
                user_email: str = Depends(get_current_user)):
    if not store.delete_task(db, task_id, user_email):
        raise HTTPException(status_code=404, detail="Task not found")
