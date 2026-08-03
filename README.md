# WhatsApp Quiz Application & Candidate Learning Analytics Engine

A production-quality, full-stack **WhatsApp-style Quiz Application** built with candidate evaluation analytics, including **Learning Velocity Index (LVI)**, **Fatigue & Attention Decay Analysis**, and **Question Difficulty Score**.

---

## 1. Quick Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB (Running locally on `mongodb://localhost:27017` or a MongoDB Atlas connection string)

### Backend Setup (FastAPI & Python)
```bash
# 1. Navigate to project root and set up virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Seed MongoDB Database (Creates 50 users, 3 exams, 10 subjects, 30 chapters, 500 questions, and ~1000 simulated quiz attempts)
python seed.py

# 4. Start FastAPI Backend Server
uvicorn backend.app.main:app --reload --port 8000
```

### Frontend Setup (React & Express Vite Proxy)
```bash
# 1. Install Node dependencies
npm install

# 2. Start full-stack development app (Express backend + Vite frontend on port 3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 2. Data Model Explanation (MongoDB Collections)

The application stores data across 7 MongoDB collections with optimized compound and single indexes:

1. **`users`**: Candidate profile information (`_id`, `name`, `email`, `created_at`).
2. **`exams`**: Target competitive examinations (`_id`, `name`, `description`).
3. **`subjects`**: Academic subjects under each exam (`_id`, `exam_id`, `name`). Index on `exam_id`.
4. **`chapters`**: Specific topic chapters (`_id`, `subject_id`, `exam_id`, `name`). Index on `subject_id`.
5. **`questions`**: Question set (`_id`, `chapter_id`, `subject_id`, `exam_id`, `question_text`, `options` [4 items], `correct_option_id`, `difficulty_seed`). Index on `chapter_id`.
6. **`quizzes`**: Quiz session records (`_id`, `user_id`, `chapter_id`, `subject_id`, `exam_id`, `started_at`, `completed_at`, `status`, `total_questions`, `score`).
7. **`question_events`**: The core analytics log table where every question response logs a document (`_id`, `user_id`, `quiz_id`, `question_id`, `exam_id`, `subject_id`, `chapter_id`, `question_index_in_quiz`, `question_shown_time`, `answer_submitted_time`, `response_duration_ms`, `selected_option_id`, `is_correct`).
   - **Indexes**: Compound index on `(user_id, quiz_id)`, single index on `question_id`, single index on `chapter_id`.

---

## 3. Analytics Formulas Rationale

### 3.1 Learning Velocity Index (LVI)
- **Formula**:
  $$\text{LVI} = (0.5 \times \text{Norm}(\text{Accuracy}) + 0.3 \times \text{Norm}(\text{Speed Score}) + 0.2 \times \text{Norm}(\text{Consistency Score})) \times 100$$
- **Rationale**: Measuring student aptitude solely by accuracy ignores response speed and guessing variance. LVI synthesizes accuracy with speed (faster correct answers indicate higher mastery) and consistency (inverse coefficient of variation $\frac{\sigma}{\mu}$ where low variance shows steady comprehension). Min-Max normalization standardizes performance across candidate populations to a 0–100 percentile scale.

### 3.2 Fatigue & Attention Decay
- **Formula**:
  $$\text{Fatigue Score} = (\text{Accuracy}_{\text{First Bucket}} - \text{Accuracy}_{\text{Last Bucket}}) + \text{Norm}(\text{Response Duration}_{\text{Last Bucket}} - \text{Response Duration}_{\text{First Bucket}})$$
- **Rationale**: Groups question events into 5-question sequential buckets ($Q1\text{–}5$, $Q6\text{–}10$, $Q11\text{–}15$, $Q16\text{–}20$). As exam length increases, cognitive exhaustion leads to dropping accuracy and rising response times. A positive fatigue score flags candidates or question sets where performance degrades sharply toward the end of a quiz.

### 3.3 Question Difficulty Score
- **Formula**:
  $$\text{Difficulty Score} = (0.6 \times \text{Norm}(1 - \text{Accuracy}) + 0.4 \times \text{Norm}(\text{Avg Response Duration})) \times 100$$
- **Rationale**: A question is genuinely hard if candidates frequently answer incorrectly AND require longer reflection time to process. Weighting inverse accuracy ($60\%$) with response duration ($40\%$) identifies tricky or ambiguous questions that require curriculum review.

---

## 4. Key Features & Implementation Highlights

- **WhatsApp Chat Interface**: Interactive WhatsApp-style chat bubble questions, timed response cards, instant timestamp logging, and progress indicators.
- **50 Pre-Seeded Student Profiles**: Instant login dropdown with active historical attempt logs.
- **Full MongoDB Aggregation Pipelines**: High-performance backend analytics using `$group`, `$bucket`, `$lookup`, and `$stdDevPop`.
