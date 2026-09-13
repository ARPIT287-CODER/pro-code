import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Clock, CheckCircle2, ChevronDown, ChevronUp, Search, BookMarked, ArrowRight } from 'lucide-react';

export default function NotesPage({ onNavigateToLadder }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data.notes || []);
      if (data.notes && data.notes.length > 0) {
        setExpandedId(data.notes[0]._id);
      }
    } catch (err) {
      console.error('Failed to load notes', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(n => {
    if (!search) return true;
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.topic.toLowerCase().includes(q) || n.unit.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <BookMarked size={13} />
            <span>Curriculum Revision Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Exam Concept Notes</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Short, exam-focused concept revisions with formula shortcuts and guaranteed viva/exam markers, linked directly to the problem ladder.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search notes or formulas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Notes Accordion */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading concept notes...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const isExpanded = expandedId === note._id;
            return (
              <div
                key={note._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
              >
                {/* Note Header / Trigger */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : note._id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">{note.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">{note.unit}</span>
                        <span>&bull;</span>
                        <span>{note.topic}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {note.readTimeMinutes || 5} min read</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 text-slate-400 hover:text-white rounded-xl">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Content Body */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                    {/* Exam Tip Alert */}
                    {note.collegeExamTip && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-3 text-xs">
                        <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-300">College Exam High-Yield Tip</p>
                          <p className="text-slate-300 mt-0.5">{note.collegeExamTip}</p>
                        </div>
                      </div>
                    )}

                    {/* Markdown Render */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line space-y-3">
                      {note.content}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={onNavigateToLadder}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                      >
                        Practice Related Problems in Ladder <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
