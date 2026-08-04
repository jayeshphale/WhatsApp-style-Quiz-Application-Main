import {
  User,
  Exam,
  Subject,
  Chapter,
  Question,
  LearningVelocityUser,
  FatigueResponse,
  QuestionDifficultyItem
} from '../types/quiz';

const API_BASE = '/api';

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchExams(): Promise<Exam[]> {
  const res = await fetch(`${API_BASE}/exams`);
  if (!res.ok) throw new Error('Failed to fetch exams');
  return res.json();
}

export async function fetchSubjects(examId: string): Promise<Subject[]> {
  const res = await fetch(`${API_BASE}/exams/${examId}/subjects`);
  if (!res.ok) throw new Error('Failed to fetch subjects');
  return res.json();
}

export async function fetchChapters(subjectId: string): Promise<Chapter[]> {
  const res = await fetch(`${API_BASE}/subjects/${subjectId}/chapters`);
  if (!res.ok) throw new Error('Failed to fetch chapters');
  return res.json();
}

export async function startQuiz(userId: string, chapterId: string): Promise<{
  quiz_id: string;
  total_questions: number;
  questions: Question[];
}> {
  const res = await fetch(`${API_BASE}/quiz/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, chapter_id: chapterId })
  });
  if (!res.ok) throw new Error('Failed to start quiz');
  return res.json();
}

export async function submitAnswer(
  quizId: string,
  data: {
    question_id: string;
    selected_option_id: string;
    question_shown_time: string;
    answer_submitted_time: string;
  }
): Promise<{ is_correct: boolean; correct_option_id: string }> {
  const res = await fetch(`${API_BASE}/quiz/${quizId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit answer');
  return res.json();
}

export async function completeQuiz(quizId: string) {
  const res = await fetch(`${API_BASE}/quiz/${quizId}/complete`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to complete quiz');
  return res.json();
}

export async function fetchQuizResult(quizId: string) {
  const res = await fetch(`${API_BASE}/quiz/${quizId}/result`);
  if (!res.ok) throw new Error('Failed to fetch quiz result');
  return res.json();
}

// Analytics API calls
export async function fetchLearningVelocity(): Promise<LearningVelocityUser[]> {
  const res = await fetch(`${API_BASE}/analytics/learning-velocity`);
  if (!res.ok) throw new Error('Failed to fetch learning velocity');
  return res.json();
}

export async function fetchFatigueAnalysis(userId?: string): Promise<FatigueResponse> {
  const url = userId
    ? `${API_BASE}/analytics/fatigue/${userId}`
    : `${API_BASE}/analytics/fatigue`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch fatigue analysis');
  return res.json();
}

export async function fetchQuestionDifficulty(): Promise<QuestionDifficultyItem[]> {
  const res = await fetch(`${API_BASE}/analytics/question-difficulty`);
  if (!res.ok) throw new Error('Failed to fetch question difficulty');
  return res.json();
}
