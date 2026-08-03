import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageSquare, ArrowRight, Brain, ShieldCheck, Zap } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Bubbles Decoration */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#58BDF2]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#F9E276]/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DCE8F2] text-center p-6 sm:p-8 relative z-10 flex flex-col items-center"
      >
        {/* Top Official SkillBytes Logo */}
        <div className="p-3 bg-[#E1F3FD] rounded-2xl shadow-sm mb-6 border border-[#99D7F3] ring-4 ring-[#58BDF2]/10 inline-flex">
          <BrandLogo size="lg" />
        </div>

        {/* Hero AI Tutor Illustration Graphic */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1A6C96] to-[#58BDF2] opacity-20 animate-pulse blur-md" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1A6C96] to-[#58BDF2] text-white flex items-center justify-center shadow-lg ring-4 ring-white">
            <Brain className="w-10 h-10 text-white" />
            <div className="absolute -bottom-2 -right-2 bg-[#F9E276] text-[#1A6C96] p-1.5 rounded-full shadow ring-2 ring-white">
              <MessageSquare className="w-4 h-4 fill-[#1A6C96]" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Ready to learn <br />
          <span className="text-[#1A6C96]">something new today?</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm sm:text-base mt-2.5 max-w-xs font-normal leading-relaxed">
          Hi there! I'm your dedicated study mentor. We'll practice together through quick, friendly chat sessions—no boring, stressful exam forms.
        </p>

        {/* Feature Pills */}
        <div className="mt-6 w-full grid grid-cols-2 gap-2 text-left">
          <div className="bg-[#E1F3FD] p-2.5 rounded-2xl border border-[#99D7F3] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#1A6C96] fill-[#F9E276] shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-[#1A6C96]">Interactive Chat</div>
              <div className="text-[9px] text-[#1A6C96]">Instant mentor feedback</div>
            </div>
          </div>

          <div className="bg-[#E1F3FD] p-2.5 rounded-2xl border border-[#99D7F3] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1A6C96] shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-[#1A6C96]">Personal Growth</div>
              <div className="text-[9px] text-[#1A6C96]">Track pace & focus</div>
            </div>
          </div>
        </div>

        {/* Single Continue Button */}
        <motion.button
          id="btn-welcome-continue"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="mt-8 w-full bg-[#58BDF2] hover:bg-[#46AFE8] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer ring-2 ring-[#F9E276]/40"
        >
          <span>Let's Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};
