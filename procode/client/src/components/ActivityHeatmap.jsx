import React from 'react';
import { Flame, Zap, Calendar, Target, CheckCircle2 } from 'lucide-react';

export default function ActivityHeatmap({ submissions = [], solvedProblems = [] }) {
  // Generate past 16 weeks (112 days)
  const daysToShow = 112;
  const now = new Date();
  
  // Aggregate submissions by YYYY-MM-DD
  const subMap = {};
  submissions.forEach(s => {
    if (s.createdAt) {
      const dateKey = s.createdAt.substring(0, 10);
      subMap[dateKey] = (subMap[dateKey] || 0) + 1;
    }
  });

  const days = [];
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().substring(0, 10);
    days.push({
      date: dateKey,
      count: subMap[dateKey] || 0,
      dayOfWeek: d.getDay(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      dayOfMonth: d.getDate()
    });
  }

  // Calculate Streak & Active Days
  const activeDaysCount = Object.keys(subMap).length;
  let currentStreak = 0;
  let checkDate = new Date(now);
  while (true) {
    const key = checkDate.toISOString().substring(0, 10);
    if (subMap[key]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (currentStreak === 0) {
      // Check if yesterday had submissions
      checkDate.setDate(checkDate.getDate() - 1);
      const yKey = checkDate.toISOString().substring(0, 10);
      if (subMap[yKey]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  // Problem breakdown
  const easyCount = solvedProblems.filter(p => p.difficulty === 'Easy').length;
  const medCount = solvedProblems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = solvedProblems.filter(p => p.difficulty === 'Hard').length;
  const totalSubmissions = submissions.length;
  const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;
  const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 100;

  const getColorClass = (count) => {
    if (count === 0) return 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/50';
    if (count === 1) return 'bg-emerald-900/80 hover:bg-emerald-800 border-emerald-700/60 text-emerald-300';
    if (count === 2) return 'bg-emerald-700 hover:bg-emerald-600 border-emerald-500';
    return 'bg-emerald-500 hover:bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-500/20';
  };

  return (
    <div className="space-y-6">
      {/* 1. Consistency & Streak Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <Flame size={20} className="fill-amber-400/20" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Current Streak</p>
            <p className="text-xl font-black text-white font-mono">{currentStreak > 0 ? `${currentStreak} Days` : '1 Day'}</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Active Days</p>
            <p className="text-xl font-black text-white font-mono">{Math.max(activeDaysCount, 1)} Days</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Submissions</p>
            <p className="text-xl font-black text-white font-mono">{totalSubmissions}</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Target size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Acceptance Rate</p>
            <p className="text-xl font-black text-emerald-400 font-mono">{acceptanceRate}%</p>
          </div>
        </div>
      </div>

      {/* 2. LeetCode-Style Activity Heatmap */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar size={16} className="text-amber-400" />
              <span>Coding Activity &amp; Daily Consistency</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every solved syllabus problem and test execution logged over the past 16 weeks.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-xs bg-slate-800 border border-slate-700" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-900 border border-emerald-700" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-700 border border-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500 border border-emerald-300" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 p-1">
            {days.map((day, idx) => (
              <div
                key={idx}
                title={`${day.date}: ${day.count} submission(s)`}
                className={`w-3.5 h-3.5 rounded-xs border transition-transform hover:scale-125 cursor-pointer ${getColorClass(day.count)}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Difficulty Breakdown Bars */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Curriculum Mastery by Difficulty</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-emerald-400">Easy Problems</span>
              <span className="font-mono text-slate-300 font-bold">{easyCount} Solved</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (easyCount / 4) * 100)}%` }} />
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-amber-400">Medium Problems</span>
              <span className="font-mono text-slate-300 font-bold">{medCount} Solved</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (medCount / 2) * 100)}%` }} />
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-rose-400">Hard / Graduation</span>
              <span className="font-mono text-slate-300 font-bold">{hardCount} Solved</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (hardCount / 2) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
