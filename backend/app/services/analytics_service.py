import math
from typing import List, Dict, Any, Optional
from backend.app.db.mongo import db

def compute_learning_velocity_pipeline() -> List[Dict[str, Any]]:
    """
    5.1 Learning Velocity Index (LVI) using MongoDB aggregation pipeline:
    Group question_events by user_id -> $group accuracy, avg_response_time_ms, stdDevPop.
    """
    pipeline = [
        {
            "$group": {
                "_id": "$user_id",
                "total_events": {"$sum": 1},
                "correct_events": {
                    "$sum": {"$cond": [{"$eq": ["$is_correct", True]}, 1, 0]}
                },
                "avg_response_time_ms": {"$avg": "$response_duration_ms"},
                "stddev_response_time_ms": {"$stdDevPop": "$response_duration_ms"}
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "_id",
                "foreignField": "_id",
                "as": "user_info"
            }
        },
        {"$unwind": "$user_info"}
    ]

    raw_results = list(db.question_events.aggregate(pipeline))
    if not raw_results:
        return []

    processed = []
    for r in raw_results:
        acc = r["correct_events"] / (r["total_events"] or 1)
        avg_time = r["avg_response_time_ms"] or 0
        stddev = r["stddev_response_time_ms"] or 0

        cv = stddev / avg_time if avg_time > 0 else 0
        consistency = max(0.0, 1.0 - min(1.0, cv))

        processed.append({
            "user_id": r["_id"],
            "user": r["user_info"]["name"],
            "email": r["user_info"]["email"],
            "accuracy": acc,
            "avg_response_time_ms": avg_time,
            "consistency_score": consistency
        })

    # Min-Max Normalization
    min_acc = min(p["accuracy"] for p in processed)
    max_acc = max(p["accuracy"] for p in processed)

    min_time = min(p["avg_response_time_ms"] for p in processed)
    max_time = max(p["avg_response_time_ms"] for p in processed)

    min_cons = min(p["consistency_score"] for p in processed)
    max_cons = max(p["consistency_score"] for p in processed)

    for p in processed:
        norm_acc = (p["accuracy"] - min_acc) / (max_acc - min_acc) if max_acc > min_acc else 0.5
        norm_speed = (max_time - p["avg_response_time_ms"]) / (max_time - min_time) if max_time > min_time else 0.5
        norm_cons = (p["consistency_score"] - min_cons) / (max_cons - min_cons) if max_cons > min_cons else 0.5

        # LVI = 0.5 * norm_acc + 0.3 * norm_speed + 0.2 * norm_cons
        lvi = (0.5 * norm_acc + 0.3 * norm_speed + 0.2 * norm_cons) * 100

        p["accuracy"] = round(p["accuracy"], 3)
        p["avg_response_time_ms"] = round(p["avg_response_time_ms"], 1)
        p["consistency_score"] = round(p["consistency_score"], 3)
        p["learning_velocity_index"] = round(lvi, 1)

    processed.sort(key=lambda x: x["learning_velocity_index"], reverse=True)
    return processed

def compute_fatigue_pipeline(user_id: Optional[str] = None) -> Dict[str, Any]:
    """
    5.2 Fatigue Analysis using MongoDB $bucket pipeline on question_index_in_quiz.
    """
    match_stage = {}
    if user_id:
        match_stage["user_id"] = user_id

    pipeline = []
    if match_stage:
        pipeline.append({"$match": match_stage})

    pipeline.append({
        "$bucket": {
            "groupBy": "$question_index_in_quiz",
            "boundaries": [1, 6, 11, 16, 21],
            "default": "other",
            "output": {
                "total_questions": {"$sum": 1},
                "correct_events": {
                    "$sum": {"$cond": [{"$eq": ["$is_correct", True]}, 1, 0]}
                },
                "avg_response_time_ms": {"$avg": "$response_duration_ms"}
            }
        }
    })

    bucket_results = list(db.question_events.aggregate(pipeline))

    labels_map = {1: "Q1–5", 6: "Q6–10", 11: "Q11–15", 16: "Q16–20"}
    buckets = []

    for b in bucket_results:
        if b["_id"] in labels_map:
            acc = b["correct_events"] / (b["total_questions"] or 1)
            buckets.append({
                "bucket_label": labels_map[b["_id"]],
                "accuracy": round(acc, 3),
                "avg_response_time_ms": round(b["avg_response_time_ms"], 1),
                "total_questions": b["total_questions"]
            })

    fatigue_score = 0.0
    if len(buckets) >= 2:
        acc_drop = buckets[0]["accuracy"] - buckets[-1]["accuracy"]
        time_inc = buckets[-1]["avg_response_time_ms"] - buckets[0]["avg_response_time_ms"]
        norm_time_inc = min(1.0, max(0.0, time_inc / 8000.0))
        fatigue_score = round(acc_drop + norm_time_inc, 3)

    return {
        "user_id": user_id,
        "buckets": buckets,
        "fatigue_score": fatigue_score,
        "fatigue_detected": fatigue_score > 0.05
    }

def compute_question_difficulty_pipeline() -> List[Dict[str, Any]]:
    """
    5.3 Question Difficulty Score using MongoDB $group pipeline on question_id.
    """
    pipeline = [
        {
            "$group": {
                "_id": "$question_id",
                "total_attempts": {"$sum": 1},
                "correct_events": {
                    "$sum": {"$cond": [{"$eq": ["$is_correct", True]}, 1, 0]}
                },
                "avg_response_time_ms": {"$avg": "$response_duration_ms"}
            }
        },
        {
            "$lookup": {
                "from": "questions",
                "localField": "_id",
                "foreignField": "_id",
                "as": "question_info"
            }
        },
        {"$unwind": "$question_info"}
    ]

    raw_results = list(db.question_events.aggregate(pipeline))
    if not raw_results:
        return []

    processed = []
    for r in raw_results:
        total = r["total_attempts"] or 1
        acc_pct = (r["correct_events"] / total) * 100
        inv_acc = 1.0 - (r["correct_events"] / total)
        avg_time = r["avg_response_time_ms"] or 0

        processed.append({
            "question_id": r["_id"],
            "question_text": r["question_info"]["question_text"],
            "total_attempts": total,
            "accuracy_pct": acc_pct,
            "inv_accuracy": inv_acc,
            "avg_response_time_ms": avg_time
        })

    # Min-Max Normalization
    min_inv_acc = min(p["inv_accuracy"] for p in processed)
    max_inv_acc = max(p["inv_accuracy"] for p in processed)

    min_time = min(p["avg_response_time_ms"] for p in processed)
    max_time = max(p["avg_response_time_ms"] for p in processed)

    for p in processed:
        norm_inv_acc = (p["inv_accuracy"] - min_inv_acc) / (max_inv_acc - min_inv_acc) if max_inv_acc > min_inv_acc else 0.5
        norm_time = (p["avg_response_time_ms"] - min_time) / (max_time - min_time) if max_time > min_time else 0.5

        # Difficulty Score = 0.6 * norm_inv_accuracy + 0.4 * norm_response_time
        diff_score = (0.6 * norm_inv_acc + 0.4 * norm_time) * 100

        p["accuracy_pct"] = round(p["accuracy_pct"], 1)
        p["avg_response_time_ms"] = round(p["avg_response_time_ms"], 1)
        p["difficulty_score"] = round(diff_score, 1)

    processed.sort(key=lambda x: x["difficulty_score"], reverse=True)
    return processed
