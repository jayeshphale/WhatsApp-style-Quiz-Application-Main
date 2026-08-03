import React, { useState } from 'react';
import { Search, Brain, CheckCheck, Clock, BookOpen, Layers, Award } from 'lucide-react';
import { Exam, Subject, Chapter } from '../../types/quiz';

export interface ChatThreadItem {
  id: string;
  type: 'exam' | 'subject' | 'chapter';
  title: string;
  subtitle: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  data: Exam | Subject | Chapter;
}

interface ChatListProps {
  threads: ChatThreadItem[];
  selectedId?: string;
  onSelectThread: (thread: ChatThreadItem) => void;
  title?: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  threads,
  selectedId,
  onSelectThread,
  title = 'Your Study Conversations'
}) => {
  const [search, setSearch] = useState('');

  const filtered = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-3 bg-[#1A6C96] text-white flex items-center justify-between border-b border-[#58BDF2]/30">
        <h2 className="font-bold text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#F9E276]" />
          <span>{title}</span>
        </h2>
        <span className="text-[10px] bg-[#0F4A6A] px-2 py-0.5 rounded-full font-mono font-medium text-[#99D7F3]">
          {filtered.length} Topics
        </span>
      </div>

      {/* Search Bar */}
      <div className="p-2.5 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subjects, chapters, or exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#58BDF2] transition shadow-xs"
          />
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No matching learning chats found.
          </div>
        ) : (
          filtered.map((thread) => {
            const isSelected = selectedId === thread.id;

            return (
              <div
                key={thread.id}
                onClick={() => onSelectThread(thread)}
                className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#E1F3FD] border-l-4 border-[#58BDF2]'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Avatar Icon */}
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-transform ${
                      isSelected
                        ? 'bg-[#58BDF2] text-white'
                        : 'bg-[#E1F3FD] text-[#1A6C96]'
                    }`}
                  >
                    {thread.type === 'exam' && <Award className="w-5 h-5" />}
                    {thread.type === 'subject' && <Layers className="w-5 h-5" />}
                    {thread.type === 'chapter' && <Brain className="w-5 h-5" />}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#F9E276] ring-2 ring-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs md:text-sm text-gray-900 truncate">
                      {thread.title}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-1">
                      {thread.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                    {thread.subtitle}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5 text-[#58BDF2] shrink-0" />
                      <span className="italic">{thread.lastMessage}</span>
                    </p>

                    {thread.unreadCount && thread.unreadCount > 0 ? (
                      <span className="w-4 h-4 rounded-full bg-[#F9E276] text-[#1A6C96] text-[10px] font-bold flex items-center justify-center shrink-0 ml-1">
                        {thread.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
