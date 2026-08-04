import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquare,
  BarChart2,
  LogOut,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface ChatHeaderProps {
  activeTab: 'quiz' | 'analytics';
  setActiveTab: (tab: 'quiz' | 'analytics') => void;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onSearchClick?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeTab,
  setActiveTab,
  title = 'SkillBytes Mentor',
  subtitle = 'Online • Ready to help you learn',
  showBack = false,
  onBack,
  onSearchClick
}) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-[#1A6C96] text-white shadow-md sticky top-0 z-40 border-b border-[#58BDF2]/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* Left: Back button or Logo + Conversation Title */}
        <div className="flex items-center space-x-2.5 min-w-0">
          {showBack && onBack ? (
            <button
              id="btn-header-back"
              onClick={onBack}
              aria-label="Go back"
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition shrink-0 focus:outline-none focus:ring-2 focus:ring-[#F9E276]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}

          {/* Official Logo Container */}
          <div className="relative shrink-0">
            <div className="p-1 bg-white rounded-xl shadow-md ring-2 ring-white/20 flex items-center justify-center">
              <BrandLogo size="xs" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#F9E276] ring-2 ring-[#1A6C96]" />
          </div>

          <div className="min-w-0">
            <h1 className="font-bold text-sm md:text-base leading-tight truncate flex items-center gap-1.5 text-white">
              <span>{title}</span>
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-[#0F4A6A] text-[#99D7F3] px-1.5 py-0.2 rounded font-mono border border-[#58BDF2]/30 font-medium">
                <Sparkles className="w-2.5 h-2.5 text-[#F9E276]" /> Mentor
              </span>
            </h1>
            <p className="text-[11px] text-[#99D7F3] truncate flex items-center gap-1 font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F9E276] animate-pulse shrink-0" />
              <span className="truncate">{subtitle}</span>
            </p>
          </div>
        </div>

        {/* Center/Right: Navigation Tabs & User Profile */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-[#0F4A6A]/80 p-1 rounded-xl border border-[#58BDF2]/30 shadow-inner">
            <button
              id="tab-quiz-chat"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center space-x-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white text-[#1A6C96] shadow-sm'
                  : 'text-[#99D7F3] hover:text-white hover:bg-[#1A6C96]/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Practice Chat</span>
            </button>

            <button
              id="tab-analytics-radar"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-[#1A6C96] shadow-sm'
                  : 'text-[#99D7F3] hover:text-white hover:bg-[#1A6C96]/60'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Growth</span>
            </button>
          </div>

          {/* User Profile info & Logout */}
          {currentUser && (
            <div className="flex items-center space-x-2 pl-1 border-l border-[#58BDF2]/30">
              <div className="hidden lg:flex items-center space-x-2 bg-[#0F4A6A] px-2.5 py-1 rounded-full text-xs border border-[#58BDF2]/30">
                <div className="w-5 h-5 rounded-full bg-[#F9E276] text-[#1A6C96] flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="font-semibold text-white truncate max-w-[110px]">
                  {currentUser.name}
                </span>
              </div>

              <button
                id="btn-switch-user"
                onClick={logout}
                title="Switch Student Account"
                className="flex items-center gap-1 bg-rose-600/90 hover:bg-rose-600 text-white text-xs px-2.5 py-1.5 rounded-xl transition shadow-sm font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Switch</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
