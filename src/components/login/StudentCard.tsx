import React, { memo } from 'react';
import { motion } from 'motion/react';
import { User, LearningVelocityUser } from '../../types/quiz';
import { ChevronRight, Zap, BookOpen, Clock } from 'lucide-react';

interface StudentCardProps {
  user: User;
  analytics?: LearningVelocityUser;
  isSelected: boolean;
  isSelecting: boolean;
  onSelect: (user: User) => void;
  lastActiveText?: string;
}

export const StudentCard: React.FC<StudentCardProps> = memo(({
  user,
  analytics,
  isSelected,
  isSelecting,
  onSelect,
  lastActiveText = 'Active Yesterday'
}) => {
  const lviScore = analytics ? Math.round(analytics.learning_velocity_index) : 85;
  const quizzesCount = analytics ? Math.min(30, Math.max(8, Math.round(lviScore * 0.3 + 5))) : 18;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(user);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ scale: 1.01, backgroundColor: '#f4f8fc' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(user)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select contact ${user.name}, Learning Velocity ${lviScore}`}
      className={`p-3.5 sm:p-4 my-1.5 rounded-2xl border transition-all duration-200 cursor-pointer outline-none ${
        isSelected
          ? 'bg-[#E1F3FD] border-[#58BDF2] shadow-sm'
          : 'bg-white border-gray-200 hover:border-[#58BDF2]/50 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Contact Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1A6C96] to-[#58BDF2] text-white font-bold text-lg flex items-center justify-center shadow-xs ring-2 ring-[#58BDF2]/20">
            {user.name.charAt(0)}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#F9E276] ring-2 ring-white" />
        </div>

        {/* Middle: Student info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">
              {user.name}
            </h3>
            <span className="text-[11px] text-gray-400 font-medium shrink-0 ml-2">
              {lastActiveText}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1 font-semibold text-[#8C6D00] bg-[#FBF2C2] px-2 py-0.5 rounded-md border border-[#F9E276]/50">
              <Zap className="w-3 h-3 text-[#8C6D00] fill-[#F9E276]" />
              <span>Learning Pace {lviScore}</span>
            </span>

            <span className="inline-flex items-center gap-1 font-medium text-[#1A6C96] bg-[#E1F3FD] px-2 py-0.5 rounded-md border border-[#99D7F3]">
              <BookOpen className="w-3 h-3 text-[#58BDF2]" />
              <span>{quizzesCount} Quizzes Solved</span>
            </span>
          </div>
        </div>

        {/* Right: Chevron Arrow */}
        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#F9E276] flex items-center justify-center text-gray-400 shrink-0">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </motion.div>
  );
});

StudentCard.displayName = 'StudentCard';
