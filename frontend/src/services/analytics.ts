import {
  User,
  Question,
  QuestionEvent,
  LearningVelocityUser,
  FatigueResponse,
  FatigueBucket,
  QuestionDifficultyItem
} from '../types/quiz';

// Calculate Population Standard Deviation
function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const squareDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
}

// 5.1 Learning Velocity Index Calculation
export function computeLearningVelocity(
  users: User[],
  events: QuestionEvent[]
): LearningVelocityUser[] {
  // Group events by user_id
  const userEventsMap = new Map<string, QuestionEvent[]>();
  for (const evt of events) {
    if (!userEventsMap.has(evt.user_id)) {
      userEventsMap.set(evt.user_id, []);
    }
    userEventsMap.get(evt.user_id)!.push(evt);
  }

  interface RawUserMetric {
    user: User;
    accuracy: number;
    avgTimeMs: number;
    consistencyScore: number;
  }

  const rawMetrics: RawUserMetric[] = [];

  for (const user of users) {
    const userEvts = userEventsMap.get(user._id) || [];
    if (userEvts.length === 0) continue;

    const totalEvents = userEvts.length;
    const correctEvents = userEvts.filter(e => e.is_correct).length;
    const accuracy = correctEvents / totalEvents;

    const times = userEvts.map(e => e.response_duration_ms);
    const avgTimeMs = times.reduce((a, b) => a + b, 0) / totalEvents;

    const stdDev = calculateStdDev(times, avgTimeMs);
    const cv = avgTimeMs > 0 ? stdDev / avgTimeMs : 0;
    const consistencyScore = Math.max(0, 1 - Math.min(1, cv));

    rawMetrics.push({
      user,
      accuracy,
      avgTimeMs,
      consistencyScore
    });
  }

  if (rawMetrics.length === 0) return [];

  // Min-Max normalization parameters
  let minAcc = Infinity, maxAcc = -Infinity;
  let minTime = Infinity, maxTime = -Infinity;
  let minCons = Infinity, maxCons = -Infinity;

  for (const m of rawMetrics) {
    if (m.accuracy < minAcc) minAcc = m.accuracy;
    if (m.accuracy > maxAcc) maxAcc = m.accuracy;

    if (m.avgTimeMs < minTime) minTime = m.avgTimeMs;
    if (m.avgTimeMs > maxTime) maxTime = m.avgTimeMs;

    if (m.consistencyScore < minCons) minCons = m.consistencyScore;
    if (m.consistencyScore > maxCons) maxCons = m.consistencyScore;
  }

  // Calculate LVI per user
  const result: LearningVelocityUser[] = rawMetrics.map(m => {
    const normAcc = maxAcc > minAcc ? (m.accuracy - minAcc) / (maxAcc - minAcc) : 0.5;
    // Speed score: lower time is better, so invert first
    const normSpeed = maxTime > minTime ? (maxTime - m.avgTimeMs) / (maxTime - minTime) : 0.5;
    const normCons = maxCons > minCons ? (m.consistencyScore - minCons) / (maxCons - minCons) : 0.5;

    // Formula: LVI = 0.5 * norm_acc + 0.3 * norm_speed + 0.2 * norm_consistency
    const lvi = (0.5 * normAcc + 0.3 * normSpeed + 0.2 * normCons) * 100;

    return {
      user_id: m.user._id,
      user: m.user.name,
      email: m.user.email,
      accuracy: Math.round(m.accuracy * 1000) / 1000,
      avg_response_time_ms: Math.round(m.avgTimeMs),
      consistency_score: Math.round(m.consistencyScore * 1000) / 1000,
      learning_velocity_index: Math.round(lvi * 10) / 10
    };
  });

  // Rank descending by LVI
  result.sort((a, b) => b.learning_velocity_index - a.learning_velocity_index);
  result.forEach((item, index) => {
    item.rank = index + 1;
  });

  return result;
}

// 5.2 Fatigue Analysis Calculation
export function computeFatigueAnalysis(
  events: QuestionEvent[],
  targetUserId?: string,
  targetUserName?: string
): FatigueResponse {
  let filteredEvents = events;
  if (targetUserId) {
    filteredEvents = events.filter(e => e.user_id === targetUserId);
  }

  // Bucket boundaries: Q1-5, Q6-10, Q11-15, Q16-20
  const bucketsDef = [
    { label: 'Q1–5', range: [1, 5] as [number, number] },
    { label: 'Q6–10', range: [6, 10] as [number, number] },
    { label: 'Q11–15', range: [11, 15] as [number, number] },
    { label: 'Q16–20', range: [16, 20] as [number, number] }
  ];

  const buckets: FatigueBucket[] = bucketsDef.map(b => {
    const bucketEvents = filteredEvents.filter(
      e => e.question_index_in_quiz >= b.range[0] && e.question_index_in_quiz <= b.range[1]
    );

    const total = bucketEvents.length;
    if (total === 0) {
      return {
        bucket_label: b.label,
        question_range: b.range,
        total_questions: 0,
        accuracy: 0,
        avg_response_time_ms: 0
      };
    }

    const correct = bucketEvents.filter(e => e.is_correct).length;
    const totalTime = bucketEvents.reduce((acc, e) => acc + e.response_duration_ms, 0);

    return {
      bucket_label: b.label,
      question_range: b.range,
      total_questions: total,
      accuracy: Math.round((correct / total) * 1000) / 1000,
      avg_response_time_ms: Math.round(totalTime / total)
    };
  }).filter(b => b.total_questions > 0);

  // Fatigue Score calculation
  let fatigueScore = 0;
  if (buckets.length >= 2) {
    const firstBucket = buckets[0];
    const lastBucket = buckets[buckets.length - 1];

    const accDrop = firstBucket.accuracy - lastBucket.accuracy;
    const timeIncrease = lastBucket.avg_response_time_ms - firstBucket.avg_response_time_ms;

    // Normalize time increase to 0-1 scale assuming ~5,000ms increase is significant
    const normTimeIncrease = Math.min(1, Math.max(0, timeIncrease / 8000));

    fatigueScore = accDrop + normTimeIncrease;
  }

  return {
    user_id: targetUserId,
    user_name: targetUserName,
    buckets,
    fatigue_score: Math.round(fatigueScore * 1000) / 1000,
    fatigue_detected: fatigueScore > 0.05
  };
}

// 5.3 Question Difficulty Score Calculation
export function computeQuestionDifficulty(
  questions: Question[],
  events: QuestionEvent[]
): QuestionDifficultyItem[] {
  const qEventsMap = new Map<string, QuestionEvent[]>();
  for (const evt of events) {
    if (!qEventsMap.has(evt.question_id)) {
      qEventsMap.set(evt.question_id, []);
    }
    qEventsMap.get(evt.question_id)!.push(evt);
  }

  interface RawQMetric {
    question: Question;
    totalAttempts: number;
    accuracyPct: number;
    invAccuracy: number; // 1 - accuracy (0 to 1)
    avgResponseTimeMs: number;
  }

  const rawMetrics: RawQMetric[] = [];

  for (const q of questions) {
    const qEvts = qEventsMap.get(q._id) || [];
    if (qEvts.length === 0) continue;

    const totalAttempts = qEvts.length;
    const correctCount = qEvts.filter(e => e.is_correct).length;
    const accuracyFraction = correctCount / totalAttempts;
    const accuracyPct = accuracyFraction * 100;
    const invAccuracy = 1 - accuracyFraction;

    const totalTime = qEvts.reduce((a, b) => a + b.response_duration_ms, 0);
    const avgResponseTimeMs = totalTime / totalAttempts;

    rawMetrics.push({
      question: q,
      totalAttempts,
      accuracyPct,
      invAccuracy,
      avgResponseTimeMs
    });
  }

  if (rawMetrics.length === 0) return [];

  // Min-Max normalization bounds across all questions
  let minInvAcc = Infinity, maxInvAcc = -Infinity;
  let minTime = Infinity, maxTime = -Infinity;

  for (const m of rawMetrics) {
    if (m.invAccuracy < minInvAcc) minInvAcc = m.invAccuracy;
    if (m.invAccuracy > maxInvAcc) maxInvAcc = m.invAccuracy;

    if (m.avgResponseTimeMs < minTime) minTime = m.avgResponseTimeMs;
    if (m.avgResponseTimeMs > maxTime) maxTime = m.avgResponseTimeMs;
  }

  const result: QuestionDifficultyItem[] = rawMetrics.map(m => {
    const normInvAcc = maxInvAcc > minInvAcc ? (m.invAccuracy - minInvAcc) / (maxInvAcc - minInvAcc) : 0.5;
    const normTime = maxTime > minTime ? (m.avgResponseTimeMs - minTime) / (maxTime - minTime) : 0.5;

    // Difficulty Score = 0.6 * normalized_inverse_accuracy + 0.4 * normalized_response_time (scale 0-100)
    const difficultyScore = (0.6 * normInvAcc + 0.4 * normTime) * 100;

    return {
      question_id: m.question._id,
      question_text: m.question.question_text,
      chapter_id: m.question.chapter_id,
      difficulty_seed: m.question.difficulty_seed,
      total_attempts: m.totalAttempts,
      accuracy_pct: Math.round(m.accuracyPct * 10) / 10,
      avg_response_time_ms: Math.round(m.avgResponseTimeMs),
      difficulty_score: Math.round(difficultyScore * 10) / 10
    };
  });

  // Rank descending by Difficulty Score (hardest first)
  result.sort((a, b) => b.difficulty_score - a.difficulty_score);

  return result;
}
