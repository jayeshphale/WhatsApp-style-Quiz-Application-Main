from fastapi import APIRouter, HTTPException
from typing import List
from backend.app.db.mongo import db

router = APIRouter()

@router.get("/users")
def get_users():
    return list(db.users.find())

@router.get("/exams")
def get_exams():
    return list(db.exams.find())

@router.get("/exams/{exam_id}/subjects")
def get_subjects_by_exam(exam_id: str):
    return list(db.subjects.find({"exam_id": exam_id}))

@router.get("/subjects/{subject_id}/chapters")
def get_chapters_by_subject(subject_id: str):
    return list(db.chapters.find({"subject_id": subject_id}))

@router.get("/chapters/{chapter_id}/questions")
def get_questions_by_chapter(chapter_id: str):
    questions = list(db.questions.find({"chapter_id": chapter_id}))
    # Sanitize questions (remove correct_option_id)
    for q in questions:
        q.pop("correct_option_id", None)
    return questions
