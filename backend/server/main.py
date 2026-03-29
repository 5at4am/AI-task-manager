from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from server.auth.router import router as auth_router
from server.tasks.router import router as tasks_router
from server.ai.router import router as ai_router

load_dotenv()

app = FastAPI(title="Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(ai_router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Task Manager API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}
