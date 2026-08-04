import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  totalCount,
  filteredCount
}) => {
  return (
    <div className="p-4 bg-gray-50/80 border-b border-gray-200/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="relative flex items-center">
        <Search
          aria-hidden="true"
          className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none"
        />
        <input
          id="student-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for your name or email..."
          aria-label="Search students by name, email, or student ID"
          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 shadow-sm transition duration-200 focus:outline-none focus:border-[#58BDF2] focus:ring-2 focus:ring-[#58BDF2]/20"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search query"
            className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#58BDF2]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
