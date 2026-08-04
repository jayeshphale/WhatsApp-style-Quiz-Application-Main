import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Exam, Subject } from '../types/quiz';
import { fetchSubjects } from '../api/client';
import { ChevronRight, Layers, FileText, Sparkles } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

interface SubjectsProps {
  exam: Exam;
  onBack: () => void;
  onSelectSubject: (subject: Subject) => void;
}

export const Subjects: React.FC<SubjectsProps> = ({ exam, onBack, onSelectSubject }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects(exam._id)
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch subjects:', err);
        setLoading(false);
      });
  }, [exam._id]);

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
            <span>Target Exam: {exam.name}</span>
          </div>
          <p className="text-sm md:text-base font-semibold text-gray-900">
            Awesome choice! Which subject would you like to focus on today?
          </p>
        </div>
      </motion.div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {subjects.map((subject) => (
          <motion.div
            key={subject._id}
            id={`subject-item-${subject._id}`}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectSubject(subject)}
            className="bg-white rounded-2xl p-4.5 shadow-sm border border-gray-200 hover:border-[#58BDF2] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#E1F3FD] text-[#1A6C96] flex items-center justify-center font-bold group-hover:bg-[#58BDF2] group-hover:text-white transition-colors">
                <FileText className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base group-hover:text-[#1A6C96] transition-colors">
                  {subject.name}
                </h3>
                <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                  <Layers className="w-3 h-3 text-[#58BDF2]" /> Practice Modules Ready
                </span>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[#F9E276] group-hover:text-[#1A6C96] flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#1A6C96]" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
