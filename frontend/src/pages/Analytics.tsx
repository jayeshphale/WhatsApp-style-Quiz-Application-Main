import React, { useEffect, useState } from 'react';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  fetchLearningVelocity,
  fetchFatigueAnalysis,
  fetchQuestionDifficulty,
  fetchUsers
} from '../api/client';
import {
  LearningVelocityUser,
  FatigueResponse,
  QuestionDifficultyItem,
  User
} from '../types/quiz';
import {
  BarChart2,
  TrendingUp,
  BrainCircuit,
  Award,
  Zap,
  Activity,
  User as UserIcon,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';

export const Analytics: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'lvi' | 'fatigue' | 'difficulty'>('lvi');

  // LVI State
  const [lviList, setLviList] = useState<LearningVelocityUser[]>([]);
  const [lviLoading, setLviLoading] = useState(true);
  const [lviSearch, setLviSearch] = useState('');

  // Fatigue State
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [fatigueData, setFatigueData] = useState<FatigueResponse | null>(null);
  const [fatigueLoading, setFatigueLoading] = useState(true);

  // Difficulty State
  const [difficultyList, setDifficultyList] = useState<QuestionDifficultyItem[]>([]);
  const [diffLoading, setDiffLoading] = useState(true);
  const [diffSearch, setDiffSearch] = useState('');

  // Load LVI
  useEffect(() => {
    fetchLearningVelocity()
      .then(data => {
        setLviList(data);
        setLviLoading(false);
      })
      .catch(err => {
        console.error('Failed to load LVI:', err);
        setLviLoading(false);
      });

    fetchUsers().then(data => setUsers(data)).catch(() => {});
  }, []);

  // Load Fatigue when selectedUserId changes
  useEffect(() => {
    setFatigueLoading(true);
    fetchFatigueAnalysis(selectedUserId || undefined)
      .then(data => {
        setFatigueData(data);
        setFatigueLoading(false);
      })
      .catch(err => {
        console.error('Failed to load fatigue:', err);
        setFatigueLoading(false);
      });
  }, [selectedUserId]);

  // Load Difficulty
  useEffect(() => {
    fetchQuestionDifficulty()
      .then(data => {
        setDifficultyList(data);
        setDiffLoading(false);
      })
      .catch(err => {
        console.error('Failed to load question difficulty:', err);
        setDiffLoading(false);
      });
  }, []);

  const filteredLvi = lviList.filter(
    item =>
      item.user.toLowerCase().includes(lviSearch.toLowerCase()) ||
      item.email.toLowerCase().includes(lviSearch.toLowerCase())
  );

  const filteredDiff = difficultyList.filter(
    item =>
      item.question_text.toLowerCase().includes(diffSearch.toLowerCase()) ||
      (item.difficulty_seed && item.difficulty_seed.toLowerCase().includes(diffSearch.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1A6C96] text-white p-6 rounded-2xl shadow-lg border border-[#58BDF2]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-white rounded-2xl shadow-md shrink-0 hidden sm:block">
            <BrandLogo size="md" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[#F9E276] text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <BrainCircuit className="w-4 h-4 text-[#F9E276]" />
              <span>SkillBytes Progress & Insights</span>
            </div>
            <h2 className="text-2xl font-bold">Your Learning Insights</h2>
            <p className="text-[#99D7F3] text-xs md:text-sm mt-1 max-w-2xl font-normal">
              Track how quickly you learn, how well you stay focused during practice, and which questions challenge students the most.
            </p>
          </div>
        </div>

        <div className="bg-[#0F4A6A] px-4 py-2 rounded-xl text-xs font-mono text-[#99D7F3] flex items-center gap-2 border border-[#58BDF2]/30 shrink-0">
          <Activity className="w-4 h-4 text-[#F9E276] animate-pulse" />
          <span>Live Growth Tracking</span>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white rounded-xl p-1.5 shadow-sm space-x-1">
        <button
          id="btn-subtab-lvi"
          onClick={() => setActiveSubTab('lvi')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'lvi'
              ? 'bg-[#58BDF2] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Learning Pace Index</span>
        </button>

        <button
          id="btn-subtab-fatigue"
          onClick={() => setActiveSubTab('fatigue')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'fatigue'
              ? 'bg-[#58BDF2] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Focus & Attention</span>
        </button>

        <button
          id="btn-subtab-difficulty"
          onClick={() => setActiveSubTab('difficulty')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'difficulty'
              ? 'bg-[#58BDF2] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Question Challenge Index</span>
        </button>
      </div>

      {/* SUBTAB 1: LEARNING VELOCITY INDEX (LVI) */}
      {activeSubTab === 'lvi' && (
        <div className="space-y-4">
          
          {/* Formula description box */}
          <div className="bg-[#E1F3FD] border border-[#99D7F3] p-4 rounded-xl text-xs text-[#1A6C96] space-y-1">
            <div className="font-bold text-sm text-[#1A6C96] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#F9E276]" /> Learning Velocity Index (LVI) Formula
            </div>
            <p>
              <code className="bg-white px-2 py-0.5 rounded font-mono border border-[#99D7F3]">
                LVI = (0.5 * Norm(Accuracy) + 0.3 * Norm(Speed) + 0.2 * Norm(Consistency)) * 100
              </code>
            </p>
            <p className="text-gray-600 text-[11px]">
              Accuracy = correct / total | Speed = inverse mean response duration | Consistency = 1 - min(1, stddev / mean)
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-lvi"
                type="text"
                placeholder="Search candidates in LVI leaderboard..."
                value={lviSearch}
                onChange={e => setLviSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#58BDF2] bg-white"
              />
            </div>
            <span className="text-xs text-gray-500 font-mono">
              Showing {filteredLvi.length} Candidates
            </span>
          </div>

          {/* LVI Leaderboard Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {lviLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-[#58BDF2] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Executing MongoDB LVI Aggregation Pipeline...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1A6C96] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 px-4">Avg Response Time</th>
                      <th className="py-3 px-4">Consistency</th>
                      <th className="py-3 px-4">LVI Score (0-100)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono">
                    {filteredLvi.map(item => (
                      <tr key={item.user_id} className="hover:bg-[#F4F8FC] transition">
                        <td className="py-3 px-4 font-bold text-gray-700">
                          {item.rank && item.rank <= 3 ? (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[10px] font-bold ${
                              item.rank === 1 ? 'bg-[#F9E276] text-gray-900 font-extrabold' : item.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'
                            }`}>
                              #{item.rank}
                            </span>
                          ) : (
                            <span className="text-gray-500">#{item.rank}</span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-sans font-semibold text-gray-800">
                          <div>{item.user}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{item.email}</div>
                        </td>

                        <td className="py-3 px-4 font-bold text-[#1A6C96]">
                          {Math.round(item.accuracy * 100)}%
                        </td>

                        <td className="py-3 px-4 text-gray-600">
                          {Math.round(item.avg_response_time_ms / 100) / 10}s
                        </td>

                        <td className="py-3 px-4 text-purple-700 font-bold">
                          {Math.round(item.consistency_score * 100)}%
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-[#1A6C96] w-10">
                              {item.learning_velocity_index}
                            </span>
                            <div className="w-24 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#58BDF2] h-full rounded-full"
                                style={{ width: `${Math.min(100, item.learning_velocity_index)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: FATIGUE ANALYSIS */}
      {activeSubTab === 'fatigue' && (
        <div className="space-y-4">
          
          {/* Controls & Filter */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" /> Fatigue & Attention Decay
              </h3>
              <p className="text-xs text-gray-500">
                Tracks accuracy drops and response duration increases across 5-question quiz buckets (Q1–5, Q6–10, Q11–15, Q16–20).
              </p>
            </div>

            <div className="w-full md:w-auto flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Filter User:</span>
              <select
                id="select-user-fatigue"
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#128C7E] w-full md:w-56"
              >
                <option value="">Aggregate (All Candidates)</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fatigue Score Banner */}
          {fatigueData && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              fatigueData.fatigue_detected
                ? 'bg-[#FBF2C2] border-[#F9E276] text-[#8C6D00]'
                : 'bg-[#E1F3FD] border-[#99D7F3] text-[#1A6C96]'
            }`}>
              <div className="flex items-center space-x-3">
                {fatigueData.fatigue_detected ? (
                  <AlertTriangle className="w-6 h-6 text-[#8C6D00]" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-[#1A6C96]" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {fatigueData.fatigue_detected ? 'Fatigue Pattern Detected' : 'No Significant Fatigue'}
                  </div>
                  <div className="text-xs opacity-80">
                    Fatigue Score: <span className="font-mono font-bold">{fatigueData.fatigue_score}</span>
                    {fatigueData.user_name && ` for candidate ${fatigueData.user_name}`}
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono bg-white px-3 py-1 rounded-lg border shadow-sm">
                Buckets Analyzed: {fatigueData.buckets.length}
              </div>
            </div>
          )}

          {/* Fatigue Buckets Cards & Chart */}
          {fatigueLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="w-8 h-8 border-4 border-[#58BDF2] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Computing Question Position Bucket Aggregations...
            </div>
          ) : fatigueData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Buckets Breakdown List */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Question Bucket Metrics
                </h4>

                <div className="space-y-3">
                  {fatigueData.buckets.map((bucket, idx) => (
                    <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-full bg-[#1A6C96] text-white text-[10px] flex items-center justify-center font-bold">
                            B{idx + 1}
                          </span>
                          Bucket {bucket.bucket_label}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          Total Question Events: {bucket.total_questions}
                        </div>
                      </div>

                      <div className="text-right space-y-0.5 font-mono text-xs">
                        <div className="font-bold text-[#1A6C96]">
                          Accuracy: {Math.round(bucket.accuracy * 100)}%
                        </div>
                        <div className="text-gray-600">
                          Avg Time: {Math.round(bucket.avg_response_time_ms / 100) / 10}s
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fatigue Recharts Visual */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">
                  Response Duration Decay (ms)
                </h4>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fatigueData.buckets}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bucket_label" />
                      <YAxis yAxisId="left" orientation="left" stroke="#1A6C96" />
                      <Tooltip formatter={(value: any) => [`${value} ms`, 'Avg Time']} />
                      <Bar yAxisId="left" dataKey="avg_response_time_ms" fill="#58BDF2" radius={[6, 6, 0, 0]}>
                        {fatigueData.buckets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === fatigueData.buckets.length - 1 ? '#F9E276' : '#58BDF2'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      )}

      {/* SUBTAB 3: QUESTION DIFFICULTY */}
      {activeSubTab === 'difficulty' && (
        <div className="space-y-4">
          
          {/* Formula box */}
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-xs text-purple-900 space-y-1">
            <div className="font-bold text-sm text-purple-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-purple-600" /> Question Difficulty Formula
            </div>
            <p>
              <code className="bg-white px-2 py-0.5 rounded font-mono border border-purple-300">
                Difficulty Score = (0.6 * Norm(1 - Accuracy) + 0.4 * Norm(Avg Time)) * 100
              </code>
            </p>
            <p className="text-gray-600 text-[11px]">
              Questions ranked descending by Difficulty Score (Hardest questions first).
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-diff"
                type="text"
                placeholder="Search question text or seed..."
                value={diffSearch}
                onChange={e => setDiffSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#58BDF2] bg-white"
              />
            </div>
            <span className="text-xs text-gray-500 font-mono">
              Showing {filteredDiff.length} Questions
            </span>
          </div>

          {/* Difficulty Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {diffLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-[#58BDF2] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Aggregating Question Difficulty Metrics...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1A6C96] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Question Text</th>
                      <th className="py-3 px-4">Attempts</th>
                      <th className="py-3 px-4">Accuracy %</th>
                      <th className="py-3 px-4">Avg Duration</th>
                      <th className="py-3 px-4">Difficulty Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono">
                    {filteredDiff.map((item, idx) => (
                      <tr key={item.question_id} className="hover:bg-purple-50/40 transition">
                        <td className="py-3 px-4 font-bold text-gray-700">
                          #{idx + 1}
                        </td>

                        <td className="py-3 px-4 font-sans text-gray-800 max-w-sm">
                          <div className="font-medium line-clamp-2">{item.question_text}</div>
                          {item.difficulty_seed && (
                            <span className={`inline-block mt-1 px-1.5 py-0.2 text-[9px] rounded font-mono uppercase ${
                              item.difficulty_seed === 'hard' ? 'bg-red-100 text-red-700 font-bold' :
                              item.difficulty_seed === 'medium' ? 'bg-[#FBF2C2] text-[#8C6D00] font-semibold' : 'bg-[#E1F3FD] text-[#1A6C96]'
                            }`}>
                              Seed: {item.difficulty_seed}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-gray-600 font-bold">
                          {item.total_attempts}
                        </td>

                        <td className="py-3 px-4 font-bold text-blue-700">
                          {item.accuracy_pct}%
                        </td>

                        <td className="py-3 px-4 text-gray-600">
                          {Math.round(item.avg_response_time_ms / 100) / 10}s
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-purple-900 w-10">
                              {item.difficulty_score}
                            </span>
                            <div className="w-20 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full"
                                style={{ width: `${Math.min(100, item.difficulty_score)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
