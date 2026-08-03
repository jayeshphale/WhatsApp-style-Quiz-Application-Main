import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { QuestionOption } from '../../types/quiz';

interface OptionButtonProps {
  option: QuestionOption;
  isSelected: boolean;
  isSubmitting: boolean;
  onSelect: (optionId: string) => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  option,
  isSelected,
  isSubmitting,
  onSelect
}) => {
  const optionLetter = option.option_id.replace('opt_', '').toUpperCase();

  return (
    <motion.button
      type="button"
      whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      disabled={isSubmitting}
      onClick={() => onSelect(option.option_id)}
      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#58BDF2] ${
        isSelected
          ? 'bg-[#E1F3FD] border-[#58BDF2] text-[#1A6C96] ring-2 ring-[#58BDF2]/40 font-semibold shadow-md'
          : 'bg-white border-[#DCE8F2] hover:border-[#58BDF2] text-gray-800 hover:bg-[#F4F8FC]'
      }`}
    >
      <div className="flex items-center space-x-3 min-w-0 pr-2">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
            isSelected
              ? 'bg-[#58BDF2] text-white shadow-sm'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {optionLetter}
        </div>
        <span className="text-xs md:text-sm font-medium leading-snug break-words">
          {option.text}
        </span>
      </div>

      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          isSelected
            ? 'border-[#58BDF2] bg-[#58BDF2] text-white'
            : 'border-gray-300'
        }`}
      >
        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
      </div>
    </motion.button>
  );
};
