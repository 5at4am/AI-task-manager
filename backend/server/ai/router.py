from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from .models import SuggestRequest, SummarizeRequest, PrioritizeRequest, BreakdownRequest, AIResponse, PrioritizeResponse, BreakdownResponse
from .service import run_suggestion, run_summarize, run_prioritize, run_breakdown
from server.database import get_db
from server.tasks.router import get_current_user
from server.tasks import store as task_store

router = APIRouter(prefix="/ai", tags=["AI"])


def _to_dicts(tasks) -> list[dict]:
    return [
        {
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "priority": t.priority,
            "tags": t.tags or [],
            "due_date": str(t.due_date) if t.due_date else None,
        }
        for t in tasks
    ]


@router.post("/suggest", response_model=AIResponse)
async def suggest(body: SuggestRequest, user_email: str = Depends(get_current_user)):
    try:
        result = await run_suggestion(body.provider, body.title, body.description, body.tags)
        return AIResponse(result=result, provider=body.provider)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/summarize", response_model=AIResponse)
async def summarize(body: SummarizeRequest, db: Session = Depends(get_db),
                    user_email: str = Depends(get_current_user)):
    try:
        if body.task_ids:
            tasks = [task_store.get_task(db, tid, user_email) for tid in body.task_ids]
            tasks = [t for t in tasks if t]
        else:
            tasks = task_store.list_tasks(db, user_email)
        if not tasks:
            raise HTTPException(status_code=404, detail="No tasks found")
        result = await run_summarize(body.provider, _to_dicts(tasks))
        return AIResponse(result=result, provider=body.provider)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/prioritize", response_model=PrioritizeResponse)
async def prioritize(body: PrioritizeRequest, db: Session = Depends(get_db),
                     user_email: str = Depends(get_current_user)):
    try:
        if body.task_ids:
            tasks = [task_store.get_task(db, tid, user_email) for tid in body.task_ids]
            tasks = [t for t in tasks if t]
        else:
            tasks = task_store.list_tasks(db, user_email)

        # only rank incomplete tasks
        tasks = [t for t in tasks if t.status != "done"]
        if not tasks:
            raise HTTPException(status_code=404, detail="No incomplete tasks to prioritize")

        ranked = await run_prioritize(body.provider, _to_dicts(tasks))
        return PrioritizeResponse(tasks=ranked, provider=body.provider)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/breakdown", response_model=BreakdownResponse)
async def breakdown(body: BreakdownRequest, user_email: str = Depends(get_current_user)):
    try:
        steps = await run_breakdown(body.provider, body.title, body.description)
        return BreakdownResponse(task_title=body.title, steps=steps, provider=body.provider)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
