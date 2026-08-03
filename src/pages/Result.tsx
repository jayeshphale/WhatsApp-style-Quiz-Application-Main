import React, { useEffect, useState } from 'react';
import { fetchQuizResult } from '../api/client';
import { ResultBubble } from '../components/chat/ResultBubble';

interface ResultProps {
  quizId: string;
  onRestart: () => void;
  onViewAnalytics: () => void;
}

export const Result: React.FC<ResultProps> = ({ quizId, onRestart, onViewAnalytics }) => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizResult(quizId)
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load quiz result:', err);
        setLoading(false);
      });
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-gray-500 font-medium">
          Generating Performance Radar & Analytics Summary...
        </p>
      </div>
    );
  }

  const avgSpeedSec = result
    ? Math.round((result.total_duration_ms || 0) / (result.total_questions || 1) / 1000)
    : 0;

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto">
      <ResultBubble
        score={result?.score || 0}
        totalQuestions={result?.total_questions || 15}
        accuracyPct={result?.accuracy_pct || 0}
        avgTimeSec={avgSpeedSec}
        lviScore={Math.min(100, Math.round((result?.accuracy_pct || 75) * 0.9 + 10))}
        questionsBreakdown={result?.questions_breakdown || []}
        onRestart={onRestart}
        onViewAnalytics={onViewAnalytics}
      />
    </div>
  );
};
