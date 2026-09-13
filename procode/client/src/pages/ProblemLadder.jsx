import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, Circle, ExternalLink, Award, Sparkles, Filter, Search, ChevronRight, BookOpen, Layers, ShieldCheck, Edit3, User, School, FileDown, ShieldAlert } from 'lucide-react';
import TierBadge from '../components/TierBadge';

export default function ProblemLadder({ onSelectProblem, user, onOpenAuth, onQuickAdminLogin, onQuickStudentLogin, onEditProblem }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [searchQuery, setSearchQuery] = useState('');

  const branches = [
    'All Branches',
    'CSE (Core)',
    'CSE - AI & ML',
    'CSE - Data Science',
    'ECE (Electronics)',
    'ELCE / EEE',
    'IT (Information Tech)',
    'Mechanical / Civil'
  ];
  const topics = ['All', 'Arrays', 'Strings', 'Recursion', 'Searching', 'Stacks/Queues'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchProblems();
  }, [user]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('procode_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/problems', { headers });
      const data = await res.json();
      setProblems(data.problems || []);
    } catch (err) {
      console.error('Failed to load problems', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(p => {
    if (selectedTopic !== 'All' && p.topic.toLowerCase() !== selectedTopic.toLowerCase()) return false;
    if (selectedDifficulty !== 'All' && p.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTopic = p.topic.toLowerCase().includes(q);
      const matchExam = p.collegeExamReference && p.collegeExamReference.toLowerCase().includes(q);
      if (!matchTitle && !matchTopic && !matchExam) return false;
    }
    return true;
  });

  const solvedCount = problems.filter(p => p.isSolved).length;
  const totalCount = problems.length || 1;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Quick Feature & Host Control Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Host / Admin Quick Access */}
        <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert size={15} />
              <span>Host &amp; Faculty Console</span>
            </div>
            <p className="text-xs text-slate-300">
              {user?.role === 'admin'
                ? '⭐ Host Mode Active: You can create new questions, modify test cases, and delete problems.'
                : 'Want to add, edit, or delete questions? Access Host Mode to manage the question bank.'}
            </p>
          </div>
          <div className="mt-3">
            {user?.role === 'admin' ? (
              <button
                onClick={() => onEditProblem(null)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Edit3 size={14} /> Open Admin Question Bank
              </button>
            ) : (
              <button
                onClick={onQuickAdminLogin}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <ShieldCheck size={14} /> 👑 Enter Host Mode (1-Click)
              </button>
            )}
          </div>
        </div>

        {/* LeetCode Consistency Profile Quick Access */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={15} />
              <span>Consistency &amp; Streak Engine</span>
            </div>
            <p className="text-xs text-slate-300">
              LeetCode-style 16-week activity heatmap, daily streaks, solve rates, and college branch settings.
            </p>
          </div>
          <div className="mt-3">
            <button
              onClick={onQuickStudentLogin}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <User size={14} /> ⚡ View Rahul Profile (Heatmap Demo)
            </button>
          </div>
        </div>

        {/* Documentation PDF Quick Access */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <BookOpen size={15} />
              <span>Official System Manual</span>
            </div>
            <p className="text-xs text-slate-300">
              Publication-ready 6-page PDF with build details, host instructions, and student guide.
            </p>
          </div>
          <div className="mt-3">
            <a
              href="/download-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <FileDown size={14} /> 📄 Download Host &amp; Student PDF
            </a>
          </div>
        </div>
      </div>

      {/* Hero Banner (Roadmap Page 1 & 2) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-24 -mb-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Curriculum-Aligned DSA Ladder</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Master College Exams.<br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
              Graduate to LeetCode.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Built specifically around real syllabus units, previous-year college question papers, and lab vivas.
            Each topic ladders from foundational concepts directly to equivalent LeetCode graduation problems.
          </p>

          {/* Quick Stats Progress Bar */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  Your Syllabus Progress
                </span>
                <span className="font-mono text-amber-400 font-bold">{solvedCount} of {totalCount} Solved ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-5 py-4 rounded-2xl">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Current Tier</p>
                  <div className="mt-1">
                    <TierBadge tier={user.rankTier || 'Bronze'} size="sm" />
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800 mx-1" />
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Career Points</p>
                  <p className="text-lg font-black text-amber-400 font-mono">{user.careerPoints || 0} pts</p>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-semibold text-sm shadow-xl shadow-blue-600/25 transition cursor-pointer"
              >
                Sign In to Save Progress <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* College Engineering Branch Curriculum Pills */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <School size={15} /> College Engineering Branch Curriculum:
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Selected: <span className="text-white font-semibold">{selectedBranch}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {branches.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBranch(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedBranch === b
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search problems, topics, or exam years..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedTopic === t
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Difficulty Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            {difficulties.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Problem Ladder Cards */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading syllabus problem ladder...</p>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <Layers size={40} className="text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Problems Found</h3>
          <p className="text-sm text-slate-400 mb-4">Try clearing your search query or topic filter.</p>
          <button
            onClick={() => { setSelectedTopic('All'); setSelectedDifficulty('All'); setSearchQuery(''); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredProblems.map((prob) => {
            const diffClass = getDifficultyColor(prob.difficulty);
            return (
              <div
                key={prob._id}
                onClick={() => onSelectProblem(prob._id)}
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  prob.isSolved
                    ? 'bg-slate-900/40 border-emerald-950/60 hover:border-emerald-700/50 hover:bg-slate-900/80'
                    : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Left Side: Status & Details */}
                <div className="flex items-start sm:items-center gap-4">
                  {/* Status Checkbox */}
                  <div className="mt-1 sm:mt-0 shrink-0">
                    {prob.isSolved ? (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 size={20} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-amber-400 group-hover:border-amber-400/40 transition">
                        <Circle size={18} />
                      </div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                        {prob.title}
                      </h3>

                      {/* LeetCode Graduation Badge */}
                      {prob.isGraduationProblem && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30">
                          <Award size={12} className="text-amber-400" />
                          Graduation Problem
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-slate-300 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                        {prob.topic}
                      </span>

                      {prob.collegeExamReference && (
                        <span className="text-slate-400 bg-blue-950/40 text-blue-300/90 px-2 py-0.5 rounded-lg border border-blue-900/30 font-medium">
                          🎓 {prob.collegeExamReference}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Difficulty, Points & Action */}
                <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${diffClass}`}>
                      {prob.difficulty}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                      +{prob.points} pts
                    </span>
                  </div>

                  {user?.role === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProblem(prob);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                      title="Host Action: Edit this question in Admin Portal"
                    >
                      <Edit3 size={13} />
                      <span>Edit Question</span>
                    </button>
                  )}

                  <button
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      prob.isSolved
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20'
                    }`}
                  >
                    <span>{prob.isSolved ? 'Re-Practice' : 'Solve'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
