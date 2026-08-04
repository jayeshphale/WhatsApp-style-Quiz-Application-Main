import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface LoadingOverlayProps {
  studentName: string;
  onComplete: () => void;
}

const steps = [
  'Checking where we left off...',
  'Setting up your personal learning chat...',
  'Organizing questions for today...',
  'Almost ready!'
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  studentName,
  onComplete
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 150);
          return prev;
        }
      });
    }, 150); // Total duration ~700ms

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A6C96]/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-[#DCE8F2] text-center flex flex-col items-center"
        >
          {/* Official SkillBytes Logo */}
          <div className="p-2.5 bg-[#E1F3FD] rounded-2xl shadow-xs mb-4">
            <BrandLogo size="md" />
          </div>

          <div className="relative w-14 h-14 mx-auto mb-3 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#99D7F3] border-t-[#58BDF2] animate-spin" />
            <Brain className="w-6 h-6 text-[#1A6C96]" />
          </div>

          <h3 className="text-lg font-extrabold text-gray-900">
            Just getting everything ready for {studentName}...
          </h3>

          <p className="text-xs text-[#1A6C96] mt-1.5 h-6 font-semibold transition-all">
            {steps[stepIndex]}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#1A6C96] to-[#58BDF2] h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.12 }}
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#1A6C96] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#58BDF2]" />
            <span>Ready to learn together</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
