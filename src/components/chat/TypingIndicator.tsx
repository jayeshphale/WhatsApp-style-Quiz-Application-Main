import React from 'react';
import { motion } from 'motion/react';
import { Brain } from 'lucide-react';

interface TypingIndicatorProps {
  text?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  text = 'Your tutor is thinking...'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2 max-w-[85%] my-2"
    >
      {/* Bot Avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1A6C96] to-[#58BDF2] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
        <Brain className="w-3.5 h-3.5" />
      </div>

      {/* Typing Bubble */}
      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-[#DCE8F2] text-gray-800 flex items-center gap-3">
        <div className="flex items-center space-x-1">
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1 }}
            className="w-2 h-2 rounded-full bg-[#1A6C96]"
          />
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
            className="w-2 h-2 rounded-full bg-[#F9E276]"
          />
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.3 }}
            className="w-2 h-2 rounded-full bg-[#58BDF2]"
          />
        </div>
        <span className="text-xs font-medium text-gray-500">{text}</span>
      </div>
    </motion.div>
  );
};
