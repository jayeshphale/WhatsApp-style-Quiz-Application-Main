import time
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.db.mongo import db
from app.models.schemas import QuizStartRequest, AnswerRequest

router = APIRouter()

@router.post("/quiz/start")
def start_quiz(payload: QuizStartRequest):
    chapter = db.chapters.find_one({"_id": payload.chapter_id})
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    questions = list(db.questions.find({"chapter_id": payload.chapter_id}))
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for chapter")

    selected_qs = questions[:15]
    quiz_id = f"quiz_{int(time.time()*1000)}"

    quiz_doc = {
        "_id": quiz_id,
        "user_id": payload.user_id,
        "chapter_id": payload.chapter_id,
        "subject_id": chapter["subject_id"],
        "exam_id": chapter["exam_id"],
        "started_at": datetime.utcnow().isoformat(),
        "status": "in_progress",
        "total_questions": len(selected_qs),
        "score": 0
    }
    db.quizzes.insert_one(quiz_doc)

    sanitized_qs = []
    for q in selected_qs:
        q_copy = dict(q)
        q_copy.pop("correct_option_id", None)
        sanitized_qs.append(q_copy)

    return {
        "quiz_id": quiz_id,
        "total_questions": len(selected_qs),
        "questions": sanitized_qs
    }

@router.post("/quiz/{quiz_id}/answer")
def submit_answer(quiz_id: str, payload: AnswerRequest):
    quiz = db.quizzes.find_one({"_id": quiz_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    question = db.questions.find_one({"_id": payload.question_id})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    shown_dt = datetime.fromisoformat(payload.question_shown_time.replace("Z", "+00:00"))
    sub_dt = datetime.fromisoformat(payload.answer_submitted_time.replace("Z", "+00:00"))
    duration_ms = max(100, int((sub_dt - shown_dt).total_seconds() * 1000))

    is_correct = (question.get("correct_option_id") == payload.selected_option_id)

    existing_events_count = db.question_events.count_documents({"quiz_id": quiz_id})
    q_index = existing_events_count + 1

    event_doc = {
        "_id": f"evt_{int(time.time()*1000)}",
        "user_id": quiz["user_id"],
        "quiz_id": quiz_id,
        "question_id": payload.question_id,
        "exam_id": quiz["exam_id"],
        "subject_id": quiz["subject_id"],
        "chapter_id": quiz["chapter_id"],
        "question_index_in_quiz": q_index,
        "question_shown_time": payload.question_shown_time,
        "answer_submitted_time": payload.answer_submitted_time,
        "response_duration_ms": duration_ms,
        "selected_option_id": payload.selected_option_id,
        "is_correct": is_correct
    }
    db.question_events.insert_one(event_doc)

    return {
        "is_correct": is_correct,
        "correct_option_id": question.get("correct_option_id")
    }

@router.post("/quiz/{quiz_id}/complete")
def complete_quiz(quiz_id: str):
    quiz = db.quizzes.find_one({"_id": quiz_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    events = list(db.question_events.find({"quiz_id": quiz_id}))
    correct_count = sum(1 for e in events if e.get("is_correct"))

    db.quizzes.update_one(
        {"_id": quiz_id},
        {
            "$set": {
                "status": "completed",
                "completed_at": datetime.utcnow().isoformat(),
                "score": correct_count
            }
        }
    )

    return {
        "quiz_id": quiz_id,
        "status": "completed",
        "score": correct_count,
        "total_questions": quiz.get("total_questions", len(events))
    }

@router.get("/quiz/{quiz_id}/result")
def get_quiz_result(quiz_id: str):
    quiz = db.quizzes.find_one({"_id": quiz_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    events = list(db.question_events.find({"quiz_id": quiz_id}))
    correct_count = sum(1 for e in events if e.get("is_correct"))
    total_dur = sum(e.get("response_duration_ms", 0) for e in events)

    return {
        "quiz_id": quiz_id,
        "user_id": quiz.get("user_id"),
        "score": correct_count,
        "total_questions": quiz.get("total_questions", len(events)),
        "accuracy_pct": round((correct_count / (quiz.get("total_questions") or 1)) * 100, 1),
        "total_duration_ms": total_dur
    }
