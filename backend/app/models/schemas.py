from typing import List, Optional
from pydantic import BaseModel, Field

class UserSchema(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    email: str
    created_at: str

class ExamSchema(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    description: str

class SubjectSchema(BaseModel):
    id: str = Field(..., alias="_id")
    exam_id: str
    name: str

class ChapterSchema(BaseModel):
    id: str = Field(..., alias="_id")
    subject_id: str
    exam_id: str
    name: str

class QuestionOptionSchema(BaseModel):
    option_id: str
    text: str

class QuestionSchema(BaseModel):
    id: str = Field(..., alias="_id")
    chapter_id: str
    subject_id: str
    exam_id: str
    question_text: str
    options: List[QuestionOptionSchema]
    correct_option_id: Optional[str] = None
    difficulty_seed: Optional[str] = None

class QuizStartRequest(BaseModel):
    user_id: str
    chapter_id: str

class AnswerRequest(BaseModel):
    question_id: str
    selected_option_id: str
    question_shown_time: str
    answer_submitted_time: str

class LearningVelocityItem(BaseModel):
    user_id: str
    user: str
    email: str
    accuracy: float
    avg_response_time_ms: float
    consistency_score: float
    learning_velocity_index: float

class FatigueBucketItem(BaseModel):
    bucket_label: str
    accuracy: float
    avg_response_time_ms: float
    total_questions: int

class FatigueResponseSchema(BaseModel):
    user_id: Optional[str] = None
    buckets: List[FatigueBucketItem]
    fatigue_score: float
    fatigue_detected: bool

class QuestionDifficultyItemSchema(BaseModel):
    question_id: str
    question_text: str
    total_attempts: int
    accuracy_pct: float
    avg_response_time_ms: float
    difficulty_score: float
