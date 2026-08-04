from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import exams, quiz, analytics
from backend.app.db.mongo import init_indexes

app = FastAPI(title="WhatsApp Quiz API Server", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_indexes()

app.include_router(exams.router)
app.include_router(quiz.router)
app.include_router(analytics.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "WhatsApp Quiz FastAPI"}
