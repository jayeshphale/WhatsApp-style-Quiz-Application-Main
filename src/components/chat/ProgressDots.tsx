import React from 'react';
import { motion } from 'motion/react';
import { Check, X, Sparkles } from 'lucide-react';

export interface QuestionStatus {
  index: number;
  isAnswered: boolean;
  isCorrect?: boolean;
}

interface ProgressDotsProps {
  total: number;
  currentIndex: number;
  history?: QuestionStatus[];
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  total = 15,
  currentIndex,
  history = []
}) => {
  const completedCount = history.filter((h) => h.isAnswered).length;
  const progressPct = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-sm border border-[#DCE8F2] my-2 flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-medium text-gray-700">
        <span className="flex items-center gap-1.5 font-semibold text-[#1A6C96]">
          <Sparkles className="w-3.5 h-3.5 text-[#F9E276]" />
          <span>Question {currentIndex + 1} of {total}</span>
        </span>
        <span className="font-mono text-[11px] font-bold text-[#1A6C96] bg-[#E1F3FD] px-2 py-0.5 rounded-md border border-[#99D7F3]">
          {completedCount}/{total} Solved ({progressPct}%)
        </span>
      </div>

      {/* 15 Small Status Dots */}
      <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto py-1">
        {Array.from({ length: total }).map((_, i) => {
          const status = history.find((h) => h.index === i);
          const isCurrent = i === currentIndex;
          const isPast = i < currentIndex;

          let dotBg = 'bg-gray-200 border-gray-300 text-gray-400';
          let icon = null;

          if (status?.isAnswered) {
            if (status.isCorrect) {
              dotBg = 'bg-[#58BDF2] text-white border-[#46AFE8] shadow-sm';
              icon = <Check className="w-2.5 h-2.5 stroke-[3]" />;
            } else {
              dotBg = 'bg-rose-500 text-white border-rose-600 shadow-sm';
              icon = <X className="w-2.5 h-2.5 stroke-[3]" />;
            }
          } else if (isCurrent) {
            dotBg = 'bg-[#1A6C96] text-white ring-2 ring-[#F9E276] ring-offset-1 animate-pulse';
            icon = <span className="w-1.5 h-1.5 rounded-full bg-[#F9E276]" />;
          }

          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8 }}
              animate={{ scale: isCurrent ? 1.15 : 1 }}
              transition={{ type: 'spring', damping: 20 }}
              title={`Question ${i + 1}`}
              className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[9px] font-bold shrink-0 transition-all ${dotBg}`}
            >
              {icon || (i + 1)}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
