from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from .models import SuggestRequest, SummarizeRequest, AIResponse
from .service import run_suggestion, run_summarize
from server.database import get_db
from server.tasks.router import get_current_user
from server.tasks import store as task_store

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/suggest", response_model=AIResponse)
async def suggest(body: SuggestRequest):
    try:
        result = await run_suggestion(body.provider, body.title, body.description, body.tags)
        return AIResponse(result=result, provider=body.provider)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/summarize", response_model=AIResponse)
async def summarize(
    body: SummarizeRequest,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user),
):
    try:
        if body.task_ids:
            tasks = [task_store.get_task(db, tid, user_email) for tid in body.task_ids]
            tasks = [t for t in tasks if t]
        else:
            tasks = task_store.list_tasks(db, user_email)

        if not tasks:
            raise HTTPException(status_code=404, detail="No tasks found to summarize")

        task_dicts = [
            {
                "title": t.title,
                "status": t.status,
                "priority": t.priority,
                "tags": t.tags,
                "due_date": t.due_date,
            }
            for t in tasks
        ]
        result = await run_summarize(body.provider, task_dicts)
        return AIResponse(result=result, provider=body.provider)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
