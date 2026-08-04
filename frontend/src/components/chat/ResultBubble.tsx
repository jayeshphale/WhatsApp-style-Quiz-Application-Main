import React from 'react';
import { motion } from 'motion/react';
import { Trophy, CheckCircle2, XCircle, Clock, Zap, BarChart2, RotateCcw } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface ResultBubbleProps {
  score: number;
  totalQuestions: number;
  accuracyPct: number;
  avgTimeSec: number;
  lviScore?: number;
  questionsBreakdown?: any[];
  onRestart: () => void;
  onViewAnalytics: () => void;
}

export const ResultBubble: React.FC<ResultBubbleProps> = ({
  score,
  totalQuestions,
  accuracyPct,
  avgTimeSec,
  lviScore = 85,
  questionsBreakdown = [],
  onRestart,
  onViewAnalytics
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      className="max-w-xl mx-auto my-4 bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-900/20"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1A6C96] to-[#58BDF2] text-white p-5 md:p-6 text-center relative overflow-hidden">
        {/* Official Logo card above congratulation message */}
        <div className="inline-flex items-center justify-center p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg mb-3 ring-4 ring-white/15">
          <BrandLogo size="md" />
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#F9E276] text-[#1A6C96] flex items-center justify-center mx-auto mb-2 shadow-lg ring-4 ring-white/20">
          <Trophy className="w-6 h-6 text-[#1A6C96]" />
        </div>
        <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
          Nice work! You made it to the end. 🎉
        </h3>
        <p className="text-[#99D7F3] text-xs md:text-sm mt-1 font-medium">
          Here's how you did today
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-[#E1F3FD] border border-[#99D7F3] p-3 rounded-2xl">
            <div className="text-xl md:text-2xl font-extrabold text-[#1A6C96]">
              {score} / {totalQuestions}
            </div>
            <div className="text-[11px] text-[#1A6C96] font-semibold mt-0.5">Correct Answers</div>
          </div>

          <div className="bg-[#E1F3FD] border border-[#99D7F3] p-3 rounded-2xl">
            <div className="text-xl md:text-2xl font-extrabold text-[#58BDF2]">
              {accuracyPct}%
            </div>
            <div className="text-[11px] text-[#1A6C96] font-semibold mt-0.5">Accuracy</div>
          </div>

          <div className="bg-[#FBF2C2] border border-[#F9E276] p-3 rounded-2xl">
            <div className="text-xl md:text-2xl font-extrabold text-[#8C6D00] flex items-center justify-center gap-0.5">
              <Clock className="w-4 h-4 text-[#8C6D00]" />
              <span>{avgTimeSec}s</span>
            </div>
            <div className="text-[11px] text-[#8C6D00] font-semibold mt-0.5">Avg Speed</div>
          </div>
        </div>

        {/* Learning Velocity Badge */}
        <div className="bg-[#0F4A6A] text-white p-3.5 rounded-2xl flex items-center justify-between border border-[#58BDF2]/30 shadow-inner">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F9E276] text-[#1A6C96] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-[#1A6C96]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Learning Pace Index</div>
              <div className="text-[10px] text-[#99D7F3]">Calculated from your speed, accuracy, and consistency</div>
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#F9E276] font-mono">
            {lviScore} <span className="text-xs font-normal text-[#99D7F3]">/100</span>
          </div>
        </div>

        {/* Question breakdown list */}
        {questionsBreakdown.length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Question-by-Question Summary
            </h4>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-100">
              {questionsBreakdown.map((q: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                    q.is_correct
                      ? 'bg-emerald-50/60 border-emerald-200/80'
                      : 'bg-rose-50/60 border-rose-200/80'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 truncate">
                      Q{idx + 1}. {q.question_text}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Selected: <span className="font-mono font-bold uppercase">{q.selected_option_id}</span>
                      {!q.is_correct && q.correct_option_id && (
                        <span> • Correct: <span className="font-mono font-bold text-emerald-700 uppercase">{q.correct_option_id}</span></span>
                      )}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    {q.is_correct ? (
                      <span className="text-[#1A6C96] font-bold text-[11px] flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#58BDF2]" /> Correct
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold text-[11px] flex items-center gap-0.5">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                    <div className="text-[9px] text-gray-400 font-mono mt-0.5">
                      {Math.round((q.response_duration_ms || 0) / 1000)}s
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 bg-white hover:bg-[#F4F8FC] text-[#1A6C96] border border-[#58BDF2] py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> Practice Another Topic
          </button>

          <button
            type="button"
            onClick={onViewAnalytics}
            className="flex-1 bg-[#58BDF2] hover:bg-[#46AFE8] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            <BarChart2 className="w-4 h-4" /> Check My Progress
          </button>
        </div>
      </div>
    </motion.div>
  );
};
