import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Flame, Calendar, Sparkles, Filter, ShieldAlert, CheckCircle2, UserCheck, AlertOctagon } from 'lucide-react';
import TierBadge from '../components/TierBadge';
import { BRANCHES } from '../constants/branches';

export default function LeaderboardPage({ user, onOpenAuth }) {
  const [activeBoard, setActiveBoard] = useState('career'); // 'career', 'weekly', 'daily'
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheatModal, setShowCheatModal] = useState(false);
  const [cheatReport, setCheatReport] = useState({ targetName: '', reason: '' });
  const [reportSuccess, setReportSuccess] = useState(false);

  const batches = BRANCHES;

  useEffect(() => {
    fetchLeaderboard();
  }, [activeBoard, selectedBatch]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leaderboards/${activeBoard}?batch=${selectedBatch}`);
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportCheatSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    try {
      const token = localStorage.getItem('procode_token');
      await fetch('/api/admin/report-cheat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUserName: cheatReport.targetName,
          reason: cheatReport.reason
        })
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setShowCheatModal(false);
        setCheatReport({ targetName: '', reason: '' });
      }, 2500);
    } catch (err) {
      console.error('Failed to report', err);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Trophy size={13} />
              <span>Real Names &bull; Real Competition</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Batch &amp; Class Leaderboard</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Compete directly with classmates in your section. Points awarded once per solved problem (no farming via re-solves).
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) { onOpenAuth(); return; }
              setShowCheatModal(true);
            }}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <ShieldAlert size={14} className="text-rose-400" />
            <span>Report Suspected Cheating</span>
          </button>
        </div>
      </div>

      {/* Tabs & Batch Selector Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Leaderboard Duration Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveBoard('career')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeBoard === 'career' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Career (Lifetime)
          </button>
          <button
            onClick={() => setActiveBoard('weekly')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeBoard === 'weekly' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly Reset
          </button>
          <button
            onClick={() => setActiveBoard('daily')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeBoard === 'daily' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily (24h)
          </button>
        </div>

        {/* Section / Batch Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Batch Filter:</span>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            {batches.map(b => (
              <option key={b} value={b}>{b === 'All' ? 'All College Batches' : b}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Computing live standings...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <Trophy size={40} className="text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Standings Yet</h3>
          <p className="text-xs text-slate-400">Be the first in this batch to solve a problem and claim rank #1!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top 3 Podium (Visual Showcase) */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {/* Rank 2 (Silver) */}
              {top3[1] && (
                <div className="order-2 sm:order-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 text-center flex flex-col items-center justify-between relative shadow-xl hover:border-slate-700 transition">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 font-mono font-bold text-xs mb-3">
                    #2
                  </div>
                  <img
                    src={top3[1].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[1].name}`}
                    alt=""
                    className="w-16 h-16 rounded-full bg-slate-950 border-2 border-slate-500 p-0.5 mb-2 shadow-lg"
                  />
                  <h3 className="font-bold text-white text-base truncate max-w-[180px]">{top3[1].alias || top3[1].name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{top3[1].batch}</span>
                  <div className="my-2">
                    <TierBadge tier={top3[1].rankTier} size="xs" />
                  </div>
                  <p className="text-lg font-black text-amber-400 font-mono">{top3[1].points} pts</p>
                </div>
              )}

              {/* Rank 1 (Gold / Crown) */}
              {top3[0] && (
                <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 text-center flex flex-col items-center justify-between relative shadow-2xl scale-105 z-10">
                  <div className="absolute -top-3.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-amber-500/30">
                    <Crown size={14} className="fill-slate-950" /> #1 Champion
                  </div>
                  <img
                    src={top3[0].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[0].name}`}
                    alt=""
                    className="w-20 h-20 rounded-full bg-slate-950 border-3 border-amber-400 p-0.5 mt-2 mb-2 shadow-xl shadow-amber-500/20"
                  />
                  <h3 className="font-bold text-white text-lg truncate max-w-[200px]">{top3[0].alias || top3[0].name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{top3[0].batch}</span>
                  <div className="my-2">
                    <TierBadge tier={top3[0].rankTier} size="sm" />
                  </div>
                  <p className="text-2xl font-black text-amber-400 font-mono">{top3[0].points} pts</p>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {top3[2] && (
                <div className="order-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 text-center flex flex-col items-center justify-between relative shadow-xl hover:border-slate-700 transition">
                  <div className="w-8 h-8 rounded-full bg-amber-950/60 border border-amber-700 flex items-center justify-center text-amber-500 font-mono font-bold text-xs mb-3">
                    #3
                  </div>
                  <img
                    src={top3[2].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[2].name}`}
                    alt=""
                    className="w-16 h-16 rounded-full bg-slate-950 border-2 border-amber-700 p-0.5 mb-2 shadow-lg"
                  />
                  <h3 className="font-bold text-white text-base truncate max-w-[180px]">{top3[2].alias || top3[2].name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{top3[2].batch}</span>
                  <div className="my-2">
                    <TierBadge tier={top3[2].rankTier} size="xs" />
                  </div>
                  <p className="text-lg font-black text-amber-400 font-mono">{top3[2].points} pts</p>
                </div>
              )}
            </div>
          )}

          {/* Full Standings Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 text-center w-16">Rank</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Class / Batch</th>
                    <th className="py-3.5 px-4">Rank Tier</th>
                    <th className="py-3.5 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {leaderboard.map((student) => (
                    <tr
                      key={student.userId}
                      className={`hover:bg-slate-800/50 transition ${
                        user && user._id === student.userId ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-300">
                        {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : `#${student.rank}`}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                            alt=""
                            className="w-8 h-8 rounded-full bg-slate-950 border border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">
                              {student.alias || student.name}
                              {user && user._id === student.userId && (
                                <span className="ml-2 text-[10px] text-amber-400 font-mono uppercase bg-amber-400/20 px-1.5 py-0.5 rounded">You</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          {student.batch}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <TierBadge tier={student.rankTier} size="xs" />
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400 text-sm">
                        {student.points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cheating Report Modal (Roadmap 5 & 9) */}
      {showCheatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold">
              <ShieldAlert size={20} />
              <h3 className="text-lg text-white">Report Suspected Cheating</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Help keep ProCode fair. Reports are strictly confidential and reviewed by department faculty members.
            </p>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-semibold text-center space-y-1">
                <CheckCircle2 size={24} className="mx-auto" />
                <p>Report Submitted Successfully!</p>
                <p className="text-slate-400 font-normal">Thank you for protecting batch integrity.</p>
              </div>
            ) : (
              <form onSubmit={handleReportCheatSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Student / Account Name or Alias</label>
                  <input
                    type="text"
                    required
                    value={cheatReport.targetName}
                    onChange={(e) => setCheatReport({ ...cheatReport, targetName: e.target.value })}
                    placeholder="e.g. CodeNinja99"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Reason / Suspicious Activity Details</label>
                  <textarea
                    rows={3}
                    required
                    value={cheatReport.reason}
                    onChange={(e) => setCheatReport({ ...cheatReport, reason: e.target.value })}
                    placeholder="e.g. Plagiarized identical code from another source, or rapid submissions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheatModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
