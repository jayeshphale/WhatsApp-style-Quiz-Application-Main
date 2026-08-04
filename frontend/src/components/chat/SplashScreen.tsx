import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A6C96] text-white p-6"
        >
          {/* Logo container with smooth fade-in animation */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl mb-6 ring-4 ring-white/20"
          >
            <BrandLogo size="xl" />
          </motion.div>

          <motion.h1
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2"
          >
            SkillBytes AI Tutor
          </motion.h1>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-[#99D7F3] text-xs md:text-sm mt-1.5 flex items-center gap-1.5 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F9E276]" />
            Your friendly companion for mastering every topic
          </motion.p>

          {/* Loading bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '120px' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-1 bg-[#F9E276] rounded-full mt-8"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
