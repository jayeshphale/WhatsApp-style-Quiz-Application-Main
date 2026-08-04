#!/usr/bin/env python3
"""
seed.py - Populate MongoDB database with realistic WhatsApp Quiz application test data.
Creates 50 users, 3 exams, 10 subjects, 30 chapters, 500 questions, and ~1000 simulated quizzes with event history.
"""

import os
import random
import math
from datetime import datetime, timedelta
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "whatsapp_quiz_db")

FIRST_NAMES = [
    'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sanya', 'Vikram', 'Neha', 'Kabir', 'Isha',
    'Dev', 'Diya', 'Arjun', 'Meera', 'Karan', 'Riya', 'Rahul', 'Anushka', 'Aman', 'Pooja',
    'Siddharth', 'Tanvi', 'Yash', 'Kavya', 'Gaurav', 'Sneha', 'Nikhil', 'Simran', 'Varun', 'Shreya',
    'Aakash', 'Deepika', 'Manish', 'Kritika', 'Suraj', 'Divya', 'Tarun', 'Nisha', 'Raj', 'Bhavna',
    'Kunal', 'Rashmi', 'Sameer', 'Swati', 'Harsh', 'Ritika', 'Vikas', 'Monika', 'Abhishek', 'Ritu'
]

LAST_NAMES = [
    'Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Reddy', 'Joshi', 'Mehta', 'Nair',
    'Chawla', 'Bhasin', 'Deshmukh', 'Kulkarni', 'Rao', 'Agarwal', 'Shah', 'Banerjee', 'Iyer', 'Pillai'
]

def seed_database():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    print(f"Connected to MongoDB at {MONGO_URI}, database: '{DB_NAME}'")

    # Drop existing collections
    db.users.drop()
    db.exams.drop()
    db.subjects.drop()
    db.chapters.drop()
    db.questions.drop()
    db.quizzes.drop()
    db.question_events.drop()

    # Create Indexes as specified
    print("Creating MongoDB Indexes...")
    db.question_events.create_index([("user_id", 1), ("quiz_id", 1)])
    db.question_events.create_index("question_id")
    db.question_events.create_index("chapter_id")
    db.questions.create_index("chapter_id")
    db.chapters.create_index("subject_id")
    db.subjects.create_index("exam_id")

    # 1. Users (50)
    print("Seeding 50 Users...")
    users_docs = []
    for i in range(1, 51):
        f = FIRST_NAMES[(i - 1) % len(FIRST_NAMES)]
        l = LAST_NAMES[(i * 3) % len(LAST_NAMES)]
        users_docs.append({
            "_id": f"user_{i:03d}",
            "name": f"{f} {l}",
            "email": f"{f.lower()}.{l.lower()}{i}@example.com",
            "created_at": (datetime.utcnow() - timedelta(days=100 - i)).isoformat()
        })
    db.users.insert_many(users_docs)

    # 2. Exams (3)
    print("Seeding 3 Exams...")
    exams_docs = [
        {"_id": "exam_upsc", "name": "UPSC Civil Services Examination", "description": "General Studies & Indian Polity"},
        {"_id": "exam_jee", "name": "JEE Advanced", "description": "Physics, Chemistry & Mathematics for Engineering"},
        {"_id": "exam_neet", "name": "NEET UG Entrance Test", "description": "Biology, Physics & Chemistry for Medical Aspirants"}
    ]
    db.exams.insert_many(exams_docs)

    # 3. Subjects (10)
    print("Seeding 10 Subjects...")
    subjects_docs = [
        {"_id": "subj_polity", "exam_id": "exam_upsc", "name": "Indian Polity & Constitution"},
        {"_id": "subj_economy", "exam_id": "exam_upsc", "name": "Indian Economy & Development"},
        {"_id": "subj_history", "exam_id": "exam_upsc", "name": "Ancient & Modern History"},
        {"_id": "subj_geography", "exam_id": "exam_upsc", "name": "Indian & World Geography"},

        {"_id": "subj_physics_jee", "exam_id": "exam_jee", "name": "Physics (Mechanics & Electrodynamics)"},
        {"_id": "subj_chem_jee", "exam_id": "exam_jee", "name": "Chemistry (Physical & Organic)"},
        {"_id": "subj_maths_jee", "exam_id": "exam_jee", "name": "Mathematics (Calculus & Algebra)"},

        {"_id": "subj_biology_neet", "exam_id": "exam_neet", "name": "Biology (Botany & Zoology)"},
        {"_id": "subj_physics_neet", "exam_id": "exam_neet", "name": "Physics (Optics & Modern Physics)"},
        {"_id": "subj_chem_neet", "exam_id": "exam_neet", "name": "Chemistry (Inorganic & Environmental)"}
    ]
    db.subjects.insert_many(subjects_docs)

    # 4. Chapters (30)
    print("Seeding 30 Chapters...")
    chapters_docs = [
        {"_id": "chap_polity_1", "subject_id": "subj_polity", "exam_id": "exam_upsc", "name": "Preamble & Fundamental Rights"},
        {"_id": "chap_polity_2", "subject_id": "subj_polity", "exam_id": "exam_upsc", "name": "Directive Principles & Fundamental Duties"},
        {"_id": "chap_polity_3", "subject_id": "subj_polity", "exam_id": "exam_upsc", "name": "Parliament & Judiciary Structure"},

        {"_id": "chap_econ_1", "subject_id": "subj_economy", "exam_id": "exam_upsc", "name": "Monetary Policy & Inflation"},
        {"_id": "chap_econ_2", "subject_id": "subj_economy", "exam_id": "exam_upsc", "name": "Fiscal Policy & Banking Sector"},
        {"_id": "chap_econ_3", "subject_id": "subj_economy", "exam_id": "exam_upsc", "name": "International Trade & Balance of Payments"},

        {"_id": "chap_hist_1", "subject_id": "subj_history", "exam_id": "exam_upsc", "name": "Indus Valley & Vedic Civilization"},
        {"_id": "chap_hist_2", "subject_id": "subj_history", "exam_id": "exam_upsc", "name": "Freedom Struggle & National Movement"},
        {"_id": "chap_hist_3", "subject_id": "subj_history", "exam_id": "exam_upsc", "name": "Post-Independence Consolidation"},

        {"_id": "chap_geo_1", "subject_id": "subj_geography", "exam_id": "exam_upsc", "name": "Geomorphology & Plate Tectonics"},
        {"_id": "chap_geo_2", "subject_id": "subj_geography", "exam_id": "exam_upsc", "name": "Monsoons & Climate Systems"},
        {"_id": "chap_geo_3", "subject_id": "subj_geography", "exam_id": "exam_upsc", "name": "Resource Distribution & Industries"},

        {"_id": "chap_phys_1", "subject_id": "subj_physics_jee", "exam_id": "exam_jee", "name": "Kinematics & Laws of Motion"},
        {"_id": "chap_phys_2", "subject_id": "subj_physics_jee", "exam_id": "exam_jee", "name": "Work, Power & Energy"},

        {"_id": "chap_chem_1", "subject_id": "subj_chem_jee", "exam_id": "exam_jee", "name": "Chemical Bonding & Molecular Structure"},
        {"_id": "chap_chem_2", "subject_id": "subj_chem_jee", "exam_id": "exam_jee", "name": "Thermodynamics & Electrochemistry"},

        {"_id": "chap_math_1", "subject_id": "subj_maths_jee", "exam_id": "exam_jee", "name": "Differential & Integral Calculus"},
        {"_id": "chap_math_2", "subject_id": "subj_maths_jee", "exam_id": "exam_jee", "name": "Matrices, Determinants & Vectors"},
        {"_id": "chap_math_3", "subject_id": "subj_maths_jee", "exam_id": "exam_jee", "name": "Probability & Complex Numbers"},

        {"_id": "chap_bio_1", "subject_id": "subj_biology_neet", "exam_id": "exam_neet", "name": "Cell Biology & Genetics"},
        {"_id": "chap_bio_2", "subject_id": "subj_biology_neet", "exam_id": "exam_neet", "name": "Human Physiology & Anatomy"},
        {"_id": "chap_bio_3", "subject_id": "subj_biology_neet", "exam_id": "exam_neet", "name": "Plant Physiology & Ecology"},
        {"_id": "chap_bio_4", "subject_id": "subj_biology_neet", "exam_id": "exam_neet", "name": "Biotechnology & Applications"},

        {"_id": "chap_phys_neet_1", "subject_id": "subj_physics_neet", "exam_id": "exam_neet", "name": "Ray & Wave Optics"},
        {"_id": "chap_phys_neet_2", "subject_id": "subj_physics_neet", "exam_id": "exam_neet", "name": "Dual Nature of Matter & Atoms"},

        {"_id": "chap_chem_neet_1", "subject_id": "subj_chem_neet", "exam_id": "exam_neet", "name": "Periodic Classification & Coordination Compounds"},
        {"_id": "chap_chem_neet_2", "subject_id": "subj_chem_neet", "exam_id": "exam_neet", "name": "Environmental Chemistry & Polymers"},
        {"_id": "chap_chem_neet_3", "subject_id": "subj_chem_neet", "exam_id": "exam_neet", "name": "Biomolecules & Organic Reactions"}
    ]
    db.chapters.insert_many(chapters_docs)

    # 5. Questions (500)
    print("Seeding 500 Questions...")
    questions_docs = []
    diffs = ["easy", "medium", "hard"]
    for i in range(1, 501):
        chap = chapters_docs[(i - 1) % len(chapters_docs)]
        diff = diffs[i % 3]
        q_id = f"q_{i:04d}"
        correct_opt = ["opt_a", "opt_b", "opt_c", "opt_d"][i % 4]

        questions_docs.append({
            "_id": q_id,
            "chapter_id": chap["_id"],
            "subject_id": chap["subject_id"],
            "exam_id": chap["exam_id"],
            "question_text": f"[{chap['name']}] Question #{i}: Which statement correctly identifies parameter #{i % 7 + 1}?",
            "options": [
                {"option_id": "opt_a", "text": "Option A: Primary governing condition and mechanism A."},
                {"option_id": "opt_b", "text": "Option B: Secondary pathway under formulation B."},
                {"option_id": "opt_c", "text": "Option C: Neutral balance equilibrium condition C."},
                {"option_id": "opt_d", "text": "Option D: None of the above alternate hypothesis D."}
            ],
            "correct_option_id": correct_opt,
            "difficulty_seed": diff
        })
    db.questions.insert_many(questions_docs)

    # 6. Simulated Quizzes and Question Events (~18 quizzes per user)
    print("Seeding Quizzes and Question Events...")
    quizzes_docs = []
    events_docs = []

    quiz_counter = 1
    event_counter = 1

    for u_idx, user in enumerate(users_docs):
        # Baseline capability per user
        user_base_acc = 0.5 + 0.4 * random.random()
        user_base_speed = 7000 + 11000 * random.random()

        for qz in range(18):
            chap = chapters_docs[(u_idx * 3 + qz) % len(chapters_docs)]
            chap_qs = [q for q in questions_docs if q["chapter_id"] == chap["_id"]]
            if len(chap_qs) < 10:
                continue

            quiz_id = f"quiz_{quiz_counter:05d}"
            quiz_counter += 1

            selected_qs = chap_qs[:15]
            correct_count = 0
            start_time = datetime.utcnow() - timedelta(days=30 - qz, minutes=u_idx * 5)
            curr_time = start_time

            for q_idx, q in enumerate(selected_qs):
                q_pos = q_idx + 1

                # Fatigue calculation
                fatigue_mult = 1.0 + (q_pos - 1) * 0.025
                fatigue_penalty = (q_pos - 1) * 0.015

                # Difficulty calculation
                diff_time_mult = 1.5 if q["difficulty_seed"] == "hard" else (1.1 if q["difficulty_seed"] == "medium" else 0.8)
                diff_acc_mult = 0.7 if q["difficulty_seed"] == "hard" else (0.88 if q["difficulty_seed"] == "medium" else 1.1)

                dur_ms = int(max(2500, user_base_speed * diff_time_mult * fatigue_mult * (1 + (random.random() - 0.5) * 0.3)))
                prob = min(0.95, max(0.15, user_base_acc * diff_acc_mult - fatigue_penalty))

                is_correct = random.random() < prob
                if is_correct:
                    correct_count += 1

                shown_iso = curr_time.isoformat()
                curr_time += timedelta(milliseconds=dur_ms)
                sub_iso = curr_time.isoformat()
                curr_time += timedelta(seconds=1)

                selected_opt = q["correct_option_id"] if is_correct else random.choice([o for o in ["opt_a", "opt_b", "opt_c", "opt_d"] if o != q["correct_option_id"]])

                events_docs.append({
                    "_id": f"evt_{event_counter:06d}",
                    "user_id": user["_id"],
                    "quiz_id": quiz_id,
                    "question_id": q["_id"],
                    "exam_id": chap["exam_id"],
                    "subject_id": chap["subject_id"],
                    "chapter_id": chap["_id"],
                    "question_index_in_quiz": q_pos,
                    "question_shown_time": shown_iso,
                    "answer_submitted_time": sub_iso,
                    "response_duration_ms": dur_ms,
                    "selected_option_id": selected_opt,
                    "is_correct": is_correct
                })
                event_counter += 1

            quizzes_docs.append({
                "_id": quiz_id,
                "user_id": user["_id"],
                "chapter_id": chap["_id"],
                "subject_id": chap["subject_id"],
                "exam_id": chap["exam_id"],
                "started_at": start_time.isoformat(),
                "completed_at": curr_time.isoformat(),
                "status": "completed",
                "total_questions": len(selected_qs),
                "score": correct_count
            })

    db.quizzes.insert_many(quizzes_docs)
    db.question_events.insert_many(events_docs)

    print(f"Database seeded successfully!")
    print(f"Users: {len(users_docs)}, Exams: {len(exams_docs)}, Subjects: {len(subjects_docs)}")
    print(f"Chapters: {len(chapters_docs)}, Questions: {len(questions_docs)}")
    print(f"Quizzes: {len(quizzes_docs)}, Question Events: {len(events_docs)}")

if __name__ == "__main__":
    seed_database()
