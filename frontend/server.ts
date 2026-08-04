import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { generateSeedData } from './src/data/seedData';
import {
  computeLearningVelocity,
  computeFatigueAnalysis,
  computeQuestionDifficulty
} from './src/services/analytics';
import { Quiz, QuestionEvent } from './src/types/quiz';

// In-Memory Database initialized with seed data
const db = generateSeedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // -------------------------------------------------------------
  // Standard API Routes
  // -------------------------------------------------------------

  // GET /api/users
  app.get('/api/users', (req, res) => {
    res.json(db.users);
  });

  // GET /api/exams
  app.get('/api/exams', (req, res) => {
    res.json(db.exams);
  });

  // GET /api/exams/:exam_id/subjects
  app.get('/api/exams/:exam_id/subjects', (req, res) => {
    const { exam_id } = req.params;
    const subjects = db.subjects.filter(s => s.exam_id === exam_id);
    res.json(subjects);
  });

  // GET /api/subjects/:subject_id/chapters
  app.get('/api/subjects/:subject_id/chapters', (req, res) => {
    const { subject_id } = req.params;
    const chapters = db.chapters.filter(c => c.subject_id === subject_id);
    res.json(chapters);
  });

  // GET /api/chapters/:chapter_id/questions (returns sanitized questions without correct_option_id)
  app.get('/api/chapters/:chapter_id/questions', (req, res) => {
    const { chapter_id } = req.params;
    const questions = db.questions
      .filter(q => q.chapter_id === chapter_id)
      .map(({ correct_option_id, ...sanitized }) => sanitized);
    res.json(questions);
  });

  // POST /api/quiz/start
  app.post('/api/quiz/start', (req, res) => {
    const { user_id, chapter_id } = req.body;
    if (!user_id || !chapter_id) {
      return res.status(400).json({ error: 'user_id and chapter_id are required' });
    }

    const chapter = db.chapters.find(c => c._id === chapter_id);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    const chapQuestions = db.questions.filter(q => q.chapter_id === chapter_id);
    if (chapQuestions.length === 0) {
      return res.status(404).json({ error: 'No questions available for this chapter' });
    }

    // Limit to 15 questions for a standard quiz session
    const selectedQuestions = chapQuestions.slice(0, 15);
    const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newQuiz: Quiz = {
      _id: quizId,
      user_id,
      chapter_id,
      subject_id: chapter.subject_id,
      exam_id: chapter.exam_id,
      started_at: new Date().toISOString(),
      status: 'in_progress',
      total_questions: selectedQuestions.length,
      score: 0
    };

    db.quizzes.push(newQuiz);

    // Return quiz details and sanitized questions
    const sanitizedQuestions = selectedQuestions.map(
      ({ correct_option_id, ...sanitized }) => sanitized
    );

    res.json({
      quiz_id: quizId,
      total_questions: selectedQuestions.length,
      questions: sanitizedQuestions
    });
  });

  // POST /api/quiz/:quiz_id/answer
  app.post('/api/quiz/:quiz_id/answer', (req, res) => {
    const { quiz_id } = req.params;
    const { question_id, selected_option_id, question_shown_time, answer_submitted_time } = req.body;

    const quiz = db.quizzes.find(q => q._id === quiz_id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz session not found' });
    }

    const question = db.questions.find(q => q._id === question_id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const shownTimeMs = new Date(question_shown_time).getTime();
    const submittedTimeMs = new Date(answer_submitted_time).getTime();
    const response_duration_ms = Math.max(100, submittedTimeMs - shownTimeMs);

    const is_correct = question.correct_option_id === selected_option_id;

    // Count position in quiz based on existing logged question_events for this quiz
    const existingEvents = db.questionEvents.filter(e => e.quiz_id === quiz_id);
    const question_index_in_quiz = existingEvents.length + 1;

    const event: QuestionEvent = {
      _id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: quiz.user_id,
      quiz_id,
      question_id,
      exam_id: quiz.exam_id,
      subject_id: quiz.subject_id,
      chapter_id: quiz.chapter_id,
      question_index_in_quiz,
      question_shown_time,
      answer_submitted_time,
      response_duration_ms,
      selected_option_id,
      is_correct
    };

    db.questionEvents.push(event);

    res.json({
      is_correct,
      correct_option_id: question.correct_option_id
    });
  });

  // POST /api/quiz/:quiz_id/complete
  app.post('/api/quiz/:quiz_id/complete', (req, res) => {
    const { quiz_id } = req.params;
    const quiz = db.quizzes.find(q => q._id === quiz_id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quizEvents = db.questionEvents.filter(e => e.quiz_id === quiz_id);
    const correctCount = quizEvents.filter(e => e.is_correct).length;

    quiz.status = 'completed';
    quiz.completed_at = new Date().toISOString();
    quiz.score = correctCount;

    res.json({
      quiz_id,
      status: 'completed',
      score: correctCount,
      total_questions: quiz.total_questions,
      completed_at: quiz.completed_at
    });
  });

  // GET /api/quiz/:quiz_id/result
  app.get('/api/quiz/:quiz_id/result', (req, res) => {
    const { quiz_id } = req.params;
    const quiz = db.quizzes.find(q => q._id === quiz_id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quizEvents = db.questionEvents.filter(e => e.quiz_id === quiz_id);
    const correctCount = quizEvents.filter(e => e.is_correct).length;
    const totalDurationMs = quizEvents.reduce((acc, e) => acc + e.response_duration_ms, 0);

    // Return detailed breakdown per question
    const eventBreakdown = quizEvents.map(evt => {
      const q = db.questions.find(item => item._id === evt.question_id);
      return {
        question_id: evt.question_id,
        question_text: q ? q.question_text : 'Question',
        selected_option_id: evt.selected_option_id,
        correct_option_id: q ? q.correct_option_id : '',
        is_correct: evt.is_correct,
        response_duration_ms: evt.response_duration_ms
      };
    });

    res.json({
      quiz_id,
      user_id: quiz.user_id,
      score: correctCount,
      total_questions: quiz.total_questions,
      incorrect_count: quiz.total_questions - correctCount,
      accuracy_pct: Math.round((correctCount / (quiz.total_questions || 1)) * 100),
      total_duration_ms: totalDurationMs,
      questions_breakdown: eventBreakdown
    });
  });

  // -------------------------------------------------------------
  // Analytics APIs
  // -------------------------------------------------------------

  // 5.1 GET /api/analytics/learning-velocity
  app.get('/api/analytics/learning-velocity', (req, res) => {
    const result = computeLearningVelocity(db.users, db.questionEvents);
    res.json(result);
  });

  // 5.2 GET /api/analytics/fatigue/:user_id
  app.get('/api/analytics/fatigue/:user_id', (req, res) => {
    const { user_id } = req.params;
    const user = db.users.find(u => u._id === user_id);
    const result = computeFatigueAnalysis(db.questionEvents, user_id, user?.name);
    res.json(result);
  });

  // Aggregate GET /api/analytics/fatigue
  app.get('/api/analytics/fatigue', (req, res) => {
    const result = computeFatigueAnalysis(db.questionEvents);
    res.json(result);
  });

  // 5.3 GET /api/analytics/question-difficulty
  app.get('/api/analytics/question-difficulty', (req, res) => {
    const result = computeQuestionDifficulty(db.questions, db.questionEvents);
    res.json(result);
  });

  // Health route
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      users_count: db.users.length,
      questions_count: db.questions.length,
      events_count: db.questionEvents.length
    });
  });

  // -------------------------------------------------------------
  // Vite Integration (Dev vs Prod)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WhatsApp Quiz Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
