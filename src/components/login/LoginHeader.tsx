import React from 'react';
import { Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const LoginHeader: React.FC = () => {
  return (
    <div className="bg-[#1A6C96] p-6 md:p-8 text-white text-center relative overflow-hidden">
      {/* Decorative subtle background glows */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#58BDF2]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#F9E276]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Official SkillBytes AI Logo card above title */}
      <div className="relative inline-flex items-center justify-center p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg mb-4 ring-4 ring-white/15">
        <BrandLogo size="lg" />
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
        Who's learning today?
      </h1>
      <p className="text-[#99D7F3] text-sm md:text-base mt-1.5 max-w-md mx-auto font-normal">
        Pick your profile below to hop back into your personalized chat lessons.
      </p>

      {/* Dataset Status Badge */}
      <div className="mt-4 inline-flex items-center gap-2 bg-[#0F4A6A] backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-[#99D7F3] border border-[#58BDF2]/30 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-[#F9E276] animate-pulse" />
        <span>50 Learner Accounts</span>
        <span className="w-1 h-1 rounded-full bg-[#58BDF2]/60" />
        <span className="text-[#99D7F3]">Select to begin</span>
      </div>
    </div>
  );
};
