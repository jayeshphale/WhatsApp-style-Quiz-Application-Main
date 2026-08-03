from typing import Optional
from fastapi import APIRouter
from backend.app.services.analytics_service import (
    compute_learning_velocity_pipeline,
    compute_fatigue_pipeline,
    compute_question_difficulty_pipeline
)

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/learning-velocity")
def get_learning_velocity():
    return compute_learning_velocity_pipeline()

@router.get("/fatigue/{user_id}")
def get_user_fatigue(user_id: str):
    return compute_fatigue_pipeline(user_id=user_id)

@router.get("/fatigue")
def get_aggregate_fatigue():
    return compute_fatigue_pipeline()

@router.get("/question-difficulty")
def get_question_difficulty():
    return compute_question_difficulty_pipeline()
