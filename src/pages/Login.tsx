import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { User, LearningVelocityUser } from '../types/quiz';
import { fetchUsers, fetchLearningVelocity } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LoginHeader } from '../components/login/LoginHeader';
import { SearchBar } from '../components/login/SearchBar';
import { StudentCard } from '../components/login/StudentCard';
import { LoginFooter } from '../components/login/LoginFooter';
import { LoadingOverlay } from '../components/login/LoadingOverlay';
import { UserX, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const Login: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [analyticsMap, setAnalyticsMap] = useState<Record<string, LearningVelocityUser>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [usersData, analyticsData] = await Promise.all([
          fetchUsers(),
          fetchLearningVelocity().catch(() => [])
        ]);

        if (isMounted) {
          setUsers(usersData);

          // Map analytics by user_id
          const map: Record<string, LearningVelocityUser> = {};
          analyticsData.forEach((item) => {
            map[item.user_id] = item;
          });
          setAnalyticsMap(map);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load login data:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search filtering by name, email, or student ID (_id)
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u._id.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsSigningIn(true);
  }, []);

  const handleCompleteLogin = useCallback(() => {
    if (selectedUser) {
      login(selectedUser);
    }
  }, [selectedUser, login]);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#efeae2] p-3 sm:p-6 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/10 transition-all duration-300">
        {/* Header */}
        <LoginHeader />

        {/* Sticky Search Bar */}
        <SearchBar
          value={search}
          onChange={setSearch}
          totalCount={users.length}
          filteredCount={filteredUsers.length}
        />

        {/* Scrollable Student List Container */}
        <div className="max-h-[420px] overflow-y-auto px-4 py-2 divide-y divide-transparent">
          {loading ? (
            <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#58BDF2] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium text-gray-700">Just getting everything ready for you...</p>
              <p className="text-xs text-gray-400 mt-1">Gathering student profiles</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty Search State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 px-4 text-center flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
                <UserX className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-gray-800">We couldn't find that profile</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                No student matched "{search}". Double-check the spelling or try searching by name or email.
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-4 px-4 py-2 bg-[#E1F3FD] text-[#1A6C96] hover:bg-[#99D7F3]/50 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-[#99D7F3] focus:outline-none focus:ring-2 focus:ring-[#58BDF2]"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear Search
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((u) => (
                <StudentCard
                  key={u._id}
                  user={u}
                  analytics={analyticsMap[u._id]}
                  isSelected={selectedUser?._id === u._id}
                  isSelecting={isSigningIn}
                  onSelect={handleSelectUser}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <LoginFooter totalCount={users.length} filteredCount={filteredUsers.length} />
      </div>

      {/* Signing In Loading Overlay */}
      {isSigningIn && selectedUser && (
        <LoadingOverlay
          studentName={selectedUser.name}
          onComplete={handleCompleteLogin}
        />
      )}
    </div>
  );
};
