import React from 'react';
import { motion } from 'motion/react';
import { CheckCheck, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { Question } from '../../types/quiz';
import { BrandLogo } from '../common/BrandLogo';

interface BotQuestionBubbleProps {
  question: Question;
  index: number;
  total: number;
  shownTime?: string;
}

export const BotQuestionBubble: React.FC<BotQuestionBubbleProps> = ({
  question,
  index,
  total,
  shownTime
}) => {
  const timeStr = shownTime
    ? new Date(shownTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, x: -12, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-start gap-2 max-w-[92%] sm:max-w-[85%] my-2"
    >
      {/* Bot Logo Avatar */}
      <div className="p-1 bg-white rounded-xl shadow-xs ring-1 ring-[#58BDF2]/30 shrink-0 mt-0.5 flex items-center justify-center">
        <BrandLogo size="xs" />
      </div>

      {/* Bubble Container */}
      <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-[#DCE8F2] text-gray-800 space-y-2 relative">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5">
          <div className="text-[11px] font-bold text-[#1A6C96] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F9E276]" />
            <span>Question {index + 1} of {total}</span>
          </div>

          {question.difficulty_seed && (
            <span
              className={`px-2 py-0.5 text-[9px] rounded-full font-mono uppercase font-bold ${
                question.difficulty_seed === 'hard'
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : question.difficulty_seed === 'medium'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-[#E1F3FD] text-[#1A6C96] border border-[#99D7F3]'
              }`}
            >
              {question.difficulty_seed}
            </span>
          )}
        </div>

        <p className="text-sm md:text-base font-semibold leading-relaxed text-gray-900">
          {question.question_text}
        </p>

        <div className="text-[10px] text-gray-400 text-right pt-1 font-mono">
          {timeStr}
        </div>
      </div>
    </motion.div>
  );
};

interface UserReplyBubbleProps {
  selectedText: string;
  optionLetter: string;
  timestamp?: string;
}

export const UserReplyBubble: React.FC<UserReplyBubbleProps> = ({
  selectedText,
  optionLetter,
  timestamp
}) => {
  const timeStr = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, x: 12, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex items-start justify-end gap-2 max-w-[85%] ml-auto my-2"
    >
      <div className="bg-[#E1F3FD] text-[#1A6C96] rounded-2xl rounded-tr-none p-3.5 shadow-sm border border-[#99D7F3] relative">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A6C96] mb-0.5">
          Option {optionLetter}
        </div>
        <p className="text-xs md:text-sm font-semibold leading-snug text-gray-900">
          {selectedText}
        </p>

        <div className="flex items-center justify-end gap-1 text-[10px] text-[#1A6C96] font-mono mt-1 pt-0.5">
          <span>{timeStr}</span>
          <CheckCheck className="w-3.5 h-3.5 text-[#58BDF2]" />
        </div>
      </div>
    </motion.div>
  );
};

interface BotFeedbackBubbleProps {
  isCorrect: boolean;
  correctOptionLetter?: string;
  correctOptionText?: string;
}

export const BotFeedbackBubble: React.FC<BotFeedbackBubbleProps> = ({
  isCorrect,
  correctOptionLetter,
  correctOptionText
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-2 max-w-[90%] sm:max-w-[80%] my-2"
    >
      <div className="p-1 bg-white rounded-xl shadow-xs ring-1 ring-[#58BDF2]/30 shrink-0 mt-0.5 flex items-center justify-center">
        <BrandLogo size="xs" />
      </div>

      <div
        className={`rounded-2xl rounded-tl-none p-3.5 shadow-sm border text-xs md:text-sm space-y-1 ${
          isCorrect
            ? 'bg-[#FBF2C2]/40 border-[#F9E276] text-gray-900'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}
      >
        <div className="font-bold flex items-center gap-1.5 text-sm">
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#1A6C96] fill-[#58BDF2]/30" />
              <span className="text-[#1A6C96]">That's right! 🎉 Great job.</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-rose-600 fill-rose-600/20" />
              <span className="text-rose-800">Almost there! Here's the right answer.</span>
            </>
          )}
        </div>

        {!isCorrect && correctOptionLetter && (
          <p className="text-xs text-rose-900 font-medium">
            The correct answer is <span className="font-bold font-mono">Option {correctOptionLetter}</span>
            {correctOptionText ? `: "${correctOptionText}"` : ''}. Keep going, you've got this!
          </p>
        )}
      </div>
    </motion.div>
  );
};
