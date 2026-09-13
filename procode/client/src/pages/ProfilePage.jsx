import React, { useState, useEffect } from 'react';
import { User, Award, CheckCircle2, Clock, Cpu, Shield, Sparkles, Terminal, Edit3, Save } from 'lucide-react';
import TierBadge, { TIERS } from '../components/TierBadge';
import ActivityHeatmap from '../components/ActivityHeatmap';
import { REGISTRATION_BRANCHES } from '../constants/branches';

export default function ProfilePage({ user, onUserUpdated, onSelectProblem }) {
  const [submissions, setSubmissions] = useState([]);
  const [solvedProblemsList, setSolvedProblemsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(user?.alias || '');
  const [batch, setBatch] = useState(user?.batch || 'CSE-1A');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('procode_token');
      if (!token) return;

      const [subRes, probRes] = await Promise.all([
        fetch('/api/submissions/my', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/problems', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const subData = await subRes.json();
      const probData = await probRes.json();

      setSubmissions(subData.submissions || []);
      const solvedSet = new Set(user?.solvedProblems || []);
      setSolvedProblemsList((probData.problems || []).filter(p => solvedSet.has(p._id)));
    } catch (err) {
      console.error('Failed to load profile data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('procode_token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ alias, batch })
      });
      const data = await res.json();
      if (res.ok) {
        onUserUpdated(data.user);
        setIsEditing(false);
        setSaveMessage('Profile saved!');
        setTimeout(() => setSaveMessage(''), 2500);
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  // Tier progression logic
  const currentTier = user?.rankTier || 'Bronze';
  const points = user?.careerPoints || 0;

  const nextTierThresholds = {
    Bronze: { next: 'Silver', target: 80, prev: 0 },
    Silver: { next: 'Gold', target: 300, prev: 80 },
    Gold: { next: 'Platinum', target: 700, prev: 300 },
    Platinum: { next: 'Diamond', target: 1500, prev: 700 },
    Diamond: { next: 'Conqueror', target: 3000, prev: 1500 },
    Conqueror: { next: 'Supreme', target: 3000, prev: 3000 }
  };

  const currentTierConfig = nextTierThresholds[currentTier] || nextTierThresholds.Bronze;
  const neededPoints = Math.max(0, currentTierConfig.target - points);
  const tierProgress = currentTier === 'Conqueror'
    ? 100
    : Math.min(100, Math.round(((points - currentTierConfig.prev) / (currentTierConfig.target - currentTierConfig.prev)) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt=""
              className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-slate-700 p-1 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-white">{user?.name}</h1>
                <TierBadge tier={user?.rankTier} size="xs" />
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Alias: <span className="text-amber-400 font-semibold">{user?.alias || user?.name}</span> &bull; Batch: <span className="text-slate-200">{user?.batch}</span>
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
          >
            <Edit3 size={14} />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Alias / Batch'}</span>
          </button>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Public Alias</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Class / Section</label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {REGISTRATION_BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <Save size={14} /> Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {saveMessage && (
          <p className="text-xs text-emerald-400 font-medium mt-3">{saveMessage}</p>
        )}

        {/* Rank Tier Progression Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">
              Tier Journey: <span className="text-amber-400">{currentTier}</span> &rarr; <span className="text-blue-400">{currentTierConfig.next}</span>
            </span>
            <span className="font-mono text-slate-400">
              {currentTier === 'Conqueror' ? 'Max Tier Reached!' : `${neededPoints} pts to ${currentTierConfig.next}`}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${tierProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-mono text-slate-400 uppercase">Career Points</p>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">{points} pts</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Lifetime, never resets</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-mono text-slate-400 uppercase">Problems Solved</p>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {(user?.solvedProblems || []).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Curriculum DSA ladder</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-mono text-slate-400 uppercase">College Batch</p>
          <p className="text-2xl font-black text-blue-400 font-mono mt-1">{user?.batch}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Section leaderboard member</p>
        </div>
      </div>

      {/* LeetCode-Style Activity & Daily Consistency Engine */}
      <ActivityHeatmap submissions={submissions} solvedProblems={solvedProblemsList} />

      {/* Solved Problems List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>Solved Syllabus Problems</span>
        </div>

        {solvedProblemsList.length === 0 ? (
          <p className="text-xs text-slate-400">You haven't solved any problems yet. Start with the Arrays unit in the problem ladder!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {solvedProblemsList.map((prob) => (
              <div
                key={prob._id}
                onClick={() => onSelectProblem(prob._id)}
                className="p-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer transition group"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition">{prob.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{prob.topic} &bull; {prob.difficulty}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">+{prob.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Terminal size={18} className="text-blue-400" />
          <span>Recent Submissions</span>
        </div>

        {submissions.length === 0 ? (
          <p className="text-xs text-slate-400">No submissions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-500 border-b border-slate-800 uppercase">
                <tr>
                  <th className="py-2.5">Problem</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Language</th>
                  <th className="py-2.5">Runtime</th>
                  <th className="py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {submissions.slice(0, 10).map((sub) => (
                  <tr key={sub._id}>
                    <td className="py-2.5 text-slate-200 font-semibold">{sub.problemTitle}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded ${sub.status === 'Accepted' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 uppercase">{sub.language}</td>
                    <td className="py-2.5 text-slate-400">{sub.runtime || 15} ms</td>
                    <td className="py-2.5 text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
