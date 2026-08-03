import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "whatsapp_quiz_db")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def init_indexes():
    """Ensure required indexes exist on MongoDB collections."""
    db.question_events.create_index([("user_id", 1), ("quiz_id", 1)])
    db.question_events.create_index("question_id")
    db.question_events.create_index("chapter_id")
    db.questions.create_index("chapter_id")
    db.chapters.create_index("subject_id")
    db.subjects.create_index("exam_id")
