import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface LoadingOverlayProps {
  studentName: string;
  onFinished: () => void;
}

const STEPS = [
  'Connecting to SkillBytes AI Tutor...',
  'Loading Student Profile...',
  'Preparing Quiz...',
  'Loading Learning Analytics...'
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ studentName, onFinished }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onFinished, 200);
          return prev;
        }
      });
    }, 170); // Total duration ~700ms across 4 steps

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#075E54]/95 backdrop-blur-md p-4 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="max-w-sm w-full bg-white text-gray-900 rounded-3xl p-6 shadow-2xl border border-emerald-800 text-center flex flex-col items-center space-y-4"
      >
        <div className="p-2 bg-emerald-50 rounded-2xl shadow-xs inline-flex">
          <BrandLogo size="md" />
        </div>

        <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#075E54] flex items-center justify-center font-bold text-lg animate-pulse">
          <Brain className="w-6 h-6 text-[#075E54]" />
        </div>

        <div>
          <h3 className="font-extrabold text-base text-gray-900">
            Welcome, {studentName}!
          </h3>
          <p className="text-xs text-emerald-800 font-medium mt-0.5">
            Initialising AI Tutor Conversation
          </p>
        </div>

        {/* Progress List */}
        <div className="w-full bg-gray-50 rounded-2xl p-3.5 space-y-2 border border-gray-200/80 text-left text-xs">
          {STEPS.map((stepText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-2 transition-opacity ${
                  isDone
                    ? 'text-emerald-700 font-semibold'
                    : isCurrent
                    ? 'text-[#075E54] font-bold animate-pulse'
                    : 'text-gray-400 font-normal'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[#128C7E] animate-ping shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                )}
                <span className="text-[11px] truncate">{stepText}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="bg-[#25D366] h-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ ease: 'easeInOut', duration: 0.15 }}
          />
        </div>
      </motion.div>
    </div>
  );
};
