import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Subject, Chapter } from '../types/quiz';
import { fetchChapters } from '../api/client';
import { PlayCircle, HelpCircle, Sparkles } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

interface ChaptersProps {
  subject: Subject;
  onBack: () => void;
  onSelectChapter: (chapter: Chapter) => void;
}

export const Chapters: React.FC<ChaptersProps> = ({ subject, onBack, onSelectChapter }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters(subject._id)
      .then((data) => {
        setChapters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch chapters:', err);
        setLoading(false);
      });
  }, [subject._id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-[#58BDF2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4">
      {/* Bot Chat Bubble */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%]"
      >
        <div className="p-1 bg-white rounded-xl shadow-xs ring-1 ring-[#58BDF2]/20 shrink-0 flex items-center justify-center">
          <BrandLogo size="xs" />
        </div>

        <div className="bg-white rounded-3xl rounded-tl-none p-4 shadow-sm border border-[#DCE8F2] text-gray-800 space-y-1">
          <div className="text-[11px] font-bold text-[#1A6C96] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F9E276]" />
            <span>Subject: {subject.name}</span>
          </div>
          <p className="text-sm md:text-base font-semibold text-gray-900">
            Ready to test your knowledge on {subject.name}?
          </p>
          <p className="text-xs text-gray-500">
            Pick a chapter below and we'll start a quick 15-question practice session together.
          </p>
        </div>
      </motion.div>

      {/* Chapters List */}
      <div className="space-y-2.5 pt-1">
        {chapters.map((chap, idx) => (
          <motion.div
            key={chap._id}
            id={`chapter-item-${chap._id}`}
            whileHover={{ y: -1, scale: 1.005 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectChapter(chap)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-[#58BDF2] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3.5 min-w-0 pr-2">
              <div className="w-9 h-9 rounded-full bg-[#E1F3FD] text-[#1A6C96] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#F9E276] group-hover:text-[#1A6C96] transition-colors">
                {idx + 1}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-sm md:text-base group-hover:text-[#1A6C96] transition-colors truncate">
                  {chap.name}
                </h3>
                <div className="flex items-center space-x-2 text-[11px] text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1 text-[#1A6C96] font-medium">
                    <HelpCircle className="w-3.5 h-3.5 text-[#58BDF2]" /> 15 Questions
                  </span>
                  <span>•</span>
                  <span>Multiple Difficulties</span>
                </div>
              </div>
            </div>

            <button className="bg-[#58BDF2] group-hover:bg-[#46AFE8] text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm font-semibold shrink-0">
              <PlayCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Let's Practice</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
