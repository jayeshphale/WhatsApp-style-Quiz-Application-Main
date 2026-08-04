export interface User {
  _id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Exam {
  _id: string;
  name: string;
  description: string;
}

export interface Subject {
  _id: string;
  exam_id: string;
  name: string;
}

export interface Chapter {
  _id: string;
  subject_id: string;
  exam_id: string;
  name: string;
}

export interface QuestionOption {
  option_id: string;
  text: string;
}

export interface Question {
  _id: string;
  chapter_id: string;
  subject_id: string;
  exam_id: string;
  question_text: string;
  options: QuestionOption[];
  correct_option_id?: string; // Hidden when sending to quiz starter
  difficulty_seed?: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  _id: string;
  user_id: string;
  chapter_id: string;
  subject_id: string;
  exam_id: string;
  started_at: string;
  completed_at?: string;
  status: 'in_progress' | 'completed';
  total_questions: number;
  score?: number;
}

export interface QuestionEvent {
  _id: string;
  user_id: string;
  quiz_id: string;
  question_id: string;
  exam_id: string;
  subject_id: string;
  chapter_id: string;
  question_index_in_quiz: number;
  question_shown_time: string;
  answer_submitted_time: string;
  response_duration_ms: number;
  selected_option_id: string;
  is_correct: boolean;
}

// Analytics Types
export interface LearningVelocityUser {
  user_id: string;
  user: string;
  email: string;
  accuracy: number; // 0 to 1
  avg_response_time_ms: number;
  consistency_score: number; // 0 to 1
  learning_velocity_index: number; // 0 to 100
  rank?: number;
}

export interface FatigueBucket {
  bucket_label: string; // e.g. "Q1-5", "Q6-10"
  question_range: [number, number];
  total_questions: number;
  accuracy: number; // 0 to 1
  avg_response_time_ms: number;
}

export interface FatigueResponse {
  user_id?: string;
  user_name?: string;
  buckets: FatigueBucket[];
  fatigue_score: number;
  fatigue_detected: boolean;
}

export interface QuestionDifficultyItem {
  question_id: string;
  question_text: string;
  chapter_id: string;
  difficulty_seed?: string;
  total_attempts: number;
  accuracy_pct: number;
  avg_response_time_ms: number;
  difficulty_score: number; // 0 to 100
}
