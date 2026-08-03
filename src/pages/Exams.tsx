import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Exam } from '../types/quiz';
import { fetchExams } from '../api/client';
import { BookOpen, ChevronRight, Sparkles, Layers } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

interface ExamsProps {
  onSelectExam: (exam: Exam) => void;
}

export const Exams: React.FC<ExamsProps> = ({ onSelectExam }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams()
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load exams:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#58BDF2] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-medium">
            Just getting your study materials ready...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4">
      {/* Bot Welcome Bubble */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%]"
      >
        <div className="p-1 bg-white rounded-xl shadow-xs ring-1 ring-[#58BDF2]/20 shrink-0 flex items-center justify-center">
          <BrandLogo size="xs" />
        </div>

        <div className="bg-white rounded-3xl rounded-tl-none p-4 shadow-sm border border-[#DCE8F2] text-gray-800 space-y-1.5">
          <div className="text-[11px] font-bold text-[#1A6C96] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F9E276]" />
            <span>Your Study Mentor</span>
          </div>
          <p className="text-sm md:text-base font-semibold leading-relaxed text-gray-900">
            Hey there! Which exam are you preparing for today?
          </p>
          <p className="text-xs text-gray-500">
            Pick your goal below and we'll dive straight into subjects, chapters, and practice questions.
          </p>
        </div>
      </motion.div>

      {/* Exam Choices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {exams.map((exam) => (
          <motion.div
            key={exam._id}
            id={`exam-card-${exam._id}`}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectExam(exam)}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:border-[#58BDF2] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#E1F3FD] text-[#1A6C96] flex items-center justify-center font-bold mb-3 group-hover:bg-[#58BDF2] group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#1A6C96] transition-colors">
                {exam.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">
                {exam.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#1A6C96] bg-[#E1F3FD] px-2.5 py-1 rounded-md flex items-center gap-1 border border-[#99D7F3]">
                <Layers className="w-3 h-3 text-[#58BDF2]" /> Subjects
              </span>
              <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[#F9E276] group-hover:text-[#1A6C96] flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#1A6C96]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
