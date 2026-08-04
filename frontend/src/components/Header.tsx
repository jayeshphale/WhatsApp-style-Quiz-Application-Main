import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, BarChart2, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  activeTab: 'quiz' | 'analytics';
  setActiveTab: (tab: 'quiz' | 'analytics') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-[#075E54] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-[#075E54] font-bold shadow-inner">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight flex items-center gap-2">
              WhatsApp Quiz Engine
              <span className="text-[10px] bg-[#128C7E] text-emerald-100 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                v2.0 Analytics
              </span>
            </h1>
            <p className="text-xs text-emerald-100 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#25D366]" /> Active MongoDB Pipeline
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 bg-[#128C7E]/60 p-1 rounded-lg border border-emerald-600/40">
          <button
            id="tab-quiz-app"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'quiz'
                ? 'bg-white text-[#075E54] shadow-sm font-semibold'
                : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Quiz Chat</span>
          </button>
          <button
            id="tab-analytics-dashboard"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-[#075E54] shadow-sm font-semibold'
                : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analytics Radar</span>
          </button>
        </div>

        {/* Logged in User profile & Logout */}
        {currentUser && (
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-[#128C7E] px-3 py-1 rounded-full text-xs">
              <div className="w-6 h-6 rounded-full bg-[#25D366] text-[#075E54] flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="font-medium truncate max-w-[120px]">{currentUser.name}</span>
            </div>
            <button
              id="btn-logout"
              onClick={logout}
              title="Logout / Switch User"
              className="flex items-center space-x-1 bg-red-600/80 hover:bg-red-600 text-white text-xs px-2.5 py-1.5 rounded-md transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Switch</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
