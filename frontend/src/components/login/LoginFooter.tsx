import React from 'react';
import { Database, Users } from 'lucide-react';

interface LoginFooterProps {
  totalCount: number;
  filteredCount: number;
}

export const LoginFooter: React.FC<LoginFooterProps> = ({
  totalCount,
  filteredCount
}) => {
  return (
    <div className="p-3.5 bg-gray-50/90 border-t border-gray-200/80 text-xs text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-2 px-6">
      <div className="flex items-center gap-1.5 font-medium text-gray-700">
        <Users className="w-3.5 h-3.5 text-[#1A6C96]" />
        <span>
          {filteredCount < totalCount
            ? `Showing ${filteredCount} of ${totalCount} student profiles`
            : `${totalCount} student profiles ready`}
        </span>
      </div>

      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#1A6C96] bg-[#E1F3FD] px-2.5 py-1 rounded-md border border-[#99D7F3]">
        <Database className="w-3.5 h-3.5 text-[#58BDF2]" />
        <span>Database Connected & Ready</span>
      </div>
    </div>
  );
};
