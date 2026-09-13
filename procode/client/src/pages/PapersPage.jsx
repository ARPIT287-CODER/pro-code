import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Clock, Award, Search, ExternalLink, Filter } from 'lucide-react';

export default function PapersPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  const years = ['All', '2024', '2023'];
  const types = ['All', 'End-Semester', 'Mid-Semester', 'Lab Exam'];

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/papers');
      const data = await res.json();
      setPapers(data.papers || []);
    } catch (err) {
      console.error('Failed to load papers', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = papers.filter(p => {
    if (yearFilter !== 'All' && String(p.year) !== yearFilter) return false;
    if (typeFilter !== 'All' && p.examType.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.courseCode.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <FileText size={13} />
            <span>Official Exam Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Previous Year Question Papers (PYQs)</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Real semester papers, mid-terms, and lab viva question sets to practice with actual exam time limits and mark distributions.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search papers by subject, title or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year Filter */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {years.map(y => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  yearFilter === y ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Exam Type Select */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Papers Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading previous year papers...</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <FileText size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Papers Found</h3>
          <p className="text-xs text-slate-400 mb-4">Try clearing filters or searching for another term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper._id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                      {paper.courseCode}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {paper.examType}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    Year {paper.year}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{paper.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{paper.description}</p>
                </div>

                {/* Topics Covered */}
                {paper.topicsCovered && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {paper.topicsCovered.map((topic, i) => (
                      <span key={i} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer details & download */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock size={12} /> {paper.duration}</span>
                  <span className="flex items-center gap-1 font-mono text-amber-400/90">{paper.totalMarks} Marks</span>
                </div>

                <a
                  href={paper.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-semibold transition"
                >
                  <Download size={13} />
                  <span>Download / View</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
