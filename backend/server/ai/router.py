from fastapi import APIRouter, HTTPException
from .models import SuggestRequest, SummarizeRequest, AIResponse
from .service import run_suggestion, run_summarize
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
async def summarize(body: SummarizeRequest):
    try:
        if body.task_ids:
            tasks = [task_store.get_task(tid) for tid in body.task_ids]
            tasks = [t for t in tasks if t]
        else:
            tasks = task_store.list_tasks()

        if not tasks:
            raise HTTPException(status_code=404, detail="No tasks found to summarize")

        result = await run_summarize(body.provider, tasks)
        return AIResponse(result=result, provider=body.provider)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
