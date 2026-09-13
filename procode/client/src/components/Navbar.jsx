import React, { useState } from 'react';
import { Terminal, BookOpen, FileText, Trophy, User, LogOut, Menu, X, ShieldAlert, Sparkles, ChevronRight, FileDown } from 'lucide-react';
import TierBadge from './TierBadge';

export default function Navbar({ activePage, setActivePage, user, onOpenAuth, onQuickAdminLogin, onQuickStudentLogin, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'ladder', label: 'Problem Ladder', icon: Terminal },
    { id: 'notes', label: 'Exam Notes', icon: BookOpen },
    { id: 'papers', label: 'PYQ Papers', icon: FileText },
    { id: 'leaderboard', label: 'Leaderboards', icon: Trophy }
  ];

  if (user && user.role === 'admin') {
    navItems.push({ id: 'admin', label: '👑 Admin Portal', icon: ShieldAlert });
  }

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('ladder')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center text-amber-400">
                <Terminal size={20} className="stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-mono">
                  Pro<span className="text-amber-400">Code</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded-full font-mono">
                  College DSA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block">Exam-Ready &bull; LeetCode Bridge</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/90 text-amber-400 shadow-sm border border-slate-700/80'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}

            {/* Direct Link to Documentation PDF in Browser */}
            <a
              href="/download-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 transition cursor-pointer ml-1"
              title="View / Download System Documentation PDF"
            >
              <FileDown size={14} className="text-amber-400/80" />
              <span>Docs PDF</span>
            </a>
          </nav>

          {/* Right Side: User Profile or Login */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-1.5 pl-3 shadow-inner">
                {/* Career Points */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-xl">
                  <Sparkles size={13} />
                  <span>{user.careerPoints || 0} pts</span>
                </div>

                {/* Tier Badge */}
                <TierBadge tier={user.rankTier || 'Bronze'} size="xs" />

                {/* User Clickable Avatar */}
                <button
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-800/80 transition cursor-pointer text-left"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-100 leading-tight max-w-[100px] truncate">{user.alias || user.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono leading-tight">{user.batch}</p>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* 1-Click Host Mode Button */}
                <button
                  onClick={onQuickAdminLogin}
                  title="Click to instantly enter Host Mode to add, edit, or delete questions"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  <ShieldAlert size={14} />
                  <span>👑 Host Mode</span>
                </button>

                {/* 1-Click Student Profile Button */}
                <button
                  onClick={onQuickStudentLogin}
                  title="Click to view student profile with LeetCode-style activity heatmap and streak"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <User size={14} />
                  <span>⚡ Profile Demo</span>
                </button>

                {/* Standard Auth Button */}
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 transition cursor-pointer"
                >
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-lg">
                <span>{user.careerPoints || 0} pts</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#090D16]/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-800 text-amber-400 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500" />
                </button>
              );
            })}

            <a
              href="/download-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20"
            >
              <div className="flex items-center gap-3">
                <FileDown size={18} />
                <span>Open Documentation PDF</span>
              </div>
              <ChevronRight size={16} />
            </a>
          </div>

          {user ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div
                onClick={() => handleNav('profile')}
                className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700"
                  />
                  <div>
                    <p className="font-semibold text-sm text-white">{user.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{user.batch} &bull; {user.careerPoints} pts</p>
                  </div>
                </div>
                <TierBadge tier={user.rankTier || 'Bronze'} size="xs" />
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-sm font-medium transition"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onQuickAdminLogin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-sm font-bold transition"
              >
                <ShieldAlert size={16} /> 👑 Enter Host Mode (Faculty Admin)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onQuickStudentLogin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-xl text-sm font-semibold transition"
              >
                <User size={16} /> ⚡ View Rahul Profile (Heatmap Demo)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/25 transition"
              >
                <User size={16} /> Sign In / Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
