import React, { useState, useEffect } from 'react';
import { ShieldCheck, PlusCircle, Trash2, Edit3, Search, X, Save, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminPage({ user, initialEditingProblem, onClearInitialEditingProblem }) {
  const [stats, setStats] = useState({ totalUsers: 0, totalProblems: 0, totalPapers: 0, totalNotes: 0, totalReports: 0 });
  const [problems, setProblems] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage');
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('All');
  const [feedback, setFeedback] = useState('');
  const [editingProblem, setEditingProblem] = useState(null);

  const [form, setForm] = useState({
    title: '', topic: 'Arrays', difficulty: 'Easy', points: 10,
    collegeExamReference: 'Mid-Sem 2024 (5 Marks)', description: '',
    constraints: '1 <= N <= 10^5', sampleInput: '', sampleOutput: '',
    hiddenInput: '', hiddenOutput: '', isGraduationProblem: false, leetcodeUrl: ''
  });

  const topics = ['All', 'Arrays', 'Strings', 'Recursion', 'Searching', 'Sorting', 'Linked Lists', 'Stacks/Queues'];

  useEffect(() => { fetchData(); }, []);

  const handleOpenEditModal = (problem) => {
    const sample = (problem.sampleTestCases && problem.sampleTestCases[0]) || { input: '', expectedOutput: '' };
    const hidden = (problem.hiddenTestCases && problem.hiddenTestCases[0]) || { input: '', expectedOutput: '' };
    setEditingProblem({
      ...problem,
      sampleInput: sample.input || '',
      sampleOutput: sample.expectedOutput || '',
      hiddenInput: hidden.input || '',
      hiddenOutput: hidden.expectedOutput || ''
    });
  };

  useEffect(() => {
    if (initialEditingProblem) {
      handleOpenEditModal(initialEditingProblem);
      setActiveTab('manage');
    }
  }, [initialEditingProblem]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('procode_token');
      const h = { 'Authorization': `Bearer ${token}` };
      const [sRes, pRes, rRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: h }),
        fetch('/api/admin/problems', { headers: h }),
        fetch('/api/admin/reports', { headers: h })
      ]);
      setStats(await sRes.json());
      const pData = await pRes.json();
      setProblems(pData.problems || []);
      const rData = await rRes.json();
      setReports(rData.reports || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete problem "${title}"?`)) return;
    const token = localStorage.getItem('procode_token');
    const res = await fetch(`/api/admin/problems/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      notify(`Deleted "${title}" successfully.`);
      fetchData();
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('procode_token');
    const payload = {
      ...editingProblem,
      sampleTestCases: [{ input: editingProblem.sampleInput || '', expectedOutput: editingProblem.sampleOutput || '' }],
      hiddenTestCases: [{ input: editingProblem.hiddenInput || '', expectedOutput: editingProblem.hiddenOutput || '' }]
    };
    const res = await fetch(`/api/admin/problems/${editingProblem._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      notify(`Updated "${editingProblem.title}"!`);
      setEditingProblem(null);
      if (onClearInitialEditingProblem) onClearInitialEditingProblem();
      fetchData();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('procode_token');
    const payload = {
      ...form,
      points: Number(form.points),
      sampleTestCases: [{ input: form.sampleInput, expectedOutput: form.sampleOutput }],
      hiddenTestCases: [{ input: form.hiddenInput, expectedOutput: form.hiddenOutput }]
    };
    const res = await fetch('/api/admin/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      notify(`Problem "${form.title}" added to ladder!`);
      setForm({ ...form, title: '', description: '', sampleInput: '', sampleOutput: '', hiddenInput: '', hiddenOutput: '' });
      setActiveTab('manage');
      fetchData();
    }
  };

  const filtered = problems.filter(p => {
    if (topicFilter !== 'All' && p.topic.toLowerCase() !== topicFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <ShieldCheck size={14} /> Host &amp; Faculty Console
          </div>
          <h1 className="text-2xl font-black text-white">Question Bank Manager</h1>
          <p className="text-slate-400 text-xs">Logged in as {user?.name}. Add, edit, or delete syllabus problems.</p>
        </div>
        <button
          onClick={() => setActiveTab('create')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <PlusCircle size={15} /> + Add New Question
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Questions</p>
          <p className="text-2xl font-black text-amber-400 font-mono">{stats.totalProblems}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Students</p>
          <p className="text-2xl font-black text-white font-mono">{stats.totalUsers}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-mono text-slate-400 uppercase">PYQ Exams</p>
          <p className="text-2xl font-black text-blue-400 font-mono">{stats.totalPapers}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Reports</p>
          <p className="text-2xl font-black text-rose-400 font-mono">{stats.totalReports}</p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedback}
        </div>
      )}

      <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 max-w-xl">
        <button
          onClick={() => setActiveTab('manage')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl cursor-pointer ${activeTab === 'manage' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'}`}
        >
          Manage Questions ({problems.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl cursor-pointer ${activeTab === 'create' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'}`}
        >
          + Add Question
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl cursor-pointer ${activeTab === 'reports' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'}`}
        >
          Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl cursor-pointer ${activeTab === 'manual' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'}`}
        >
          📖 Host Manual
        </button>
      </div>

      {activeTab === 'manage' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search question titles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {topics.map(t => (
                <button
                  key={t}
                  onClick={() => setTopicFilter(t)}
                  className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer ${topicFilter === t ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {filtered.map(p => (
              <div key={p._id} className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{p.title}</h3>
                    {p.isGraduationProblem && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">Graduation</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-medium">{p.topic}</span>
                    <span className="text-amber-400 font-semibold">{p.difficulty} ({p.points} pts)</span>
                    {p.collegeExamReference && <span className="text-blue-300">🎓 {p.collegeExamReference}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Create New Syllabus Problem</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Title</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Detect Loop in Linked List" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Topic</label>
              <select value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white">
                {topics.filter(t=>t!=='All').map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Difficulty &amp; Points</label>
              <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value, points: e.target.value==='Easy'?10:e.target.value==='Medium'?25:50})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white">
                <option value="Easy">Easy (10 pts)</option>
                <option value="Medium">Medium (25 pts)</option>
                <option value="Hard">Hard (50 pts)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Exam Citation</label>
              <input value={form.collegeExamReference} onChange={e => setForm({...form, collegeExamReference: e.target.value})} placeholder="e.g. End-Sem Dec 2024 (10 Marks)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">LeetCode URL</label>
              <input value={form.leetcodeUrl} onChange={e => setForm({...form, leetcodeUrl: e.target.value})} placeholder="https://leetcode.com/problems/..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Problem Statement</label>
            <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Full problem description..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-amber-400">Sample Test Case (Visible)</p>
              <input required value={form.sampleInput} onChange={e => setForm({...form, sampleInput: e.target.value})} placeholder="Input (stdin)..." className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white font-mono" />
              <input required value={form.sampleOutput} onChange={e => setForm({...form, sampleOutput: e.target.value})} placeholder="Expected Output..." className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white font-mono" />
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-blue-400">Hidden Test Case (Grading)</p>
              <input required value={form.hiddenInput} onChange={e => setForm({...form, hiddenInput: e.target.value})} placeholder="Hidden Input..." className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white font-mono" />
              <input required value={form.hiddenOutput} onChange={e => setForm({...form, hiddenOutput: e.target.value})} placeholder="Hidden Expected Output..." className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white font-mono" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="cGrad" checked={form.isGraduationProblem} onChange={e => setForm({...form, isGraduationProblem: e.target.checked})} />
            <label htmlFor="cGrad" className="text-xs text-slate-300 cursor-pointer">Mark as Topic Graduation Problem (LeetCode bridge)</label>
          </div>

          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-blue-600/20">
            Publish Question
          </button>
        </form>
      )}

      {activeTab === 'reports' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h3 className="text-base font-bold text-white mb-2">Student Cheating Reports</h3>
          {reports.length === 0 ? (
            <p className="text-xs text-slate-400">No cheating reports. All submissions are authentic!</p>
          ) : (
            reports.map(r => (
              <div key={r._id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-400">Target: {r.targetUserName}</p>
                  <p className="text-xs text-slate-300">{r.reason}</p>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">{r.status}</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              📖 Host &amp; Administrator Operations Manual
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Complete reference guide for faculty members and platform hosts to manage questions, exams, maintenance, and student traffic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Guide Card 1: Login */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                1. How to Log In as Host / Admin
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click <strong>"Join / Sign In"</strong> on the top navigation bar. Enter the host credentials:
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200">
                Email: <span className="text-amber-400 font-bold">admin@procode.edu</span><br />
                Password: <span className="text-amber-400 font-bold">Admin@123</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tip: You can also use the 1-click <strong>"Faculty Admin"</strong> shortcut button in the sign-in modal.
              </p>
            </div>

            {/* Guide Card 2: Question Management */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
                2. Adding, Editing &amp; Deleting Questions
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                • <strong>Add Question:</strong> Go to the <em>"+ Add Question"</em> tab. Specify title, syllabus topic, points (10/25/50), exam marks tag, and test cases.<br />
                • <strong>Edit Question:</strong> In <em>"Manage Questions"</em>, click the blue <strong>"Edit"</strong> button on any problem card to modify in real-time.<br />
                • <strong>Delete Question:</strong> Click the red <strong>"Delete"</strong> button and confirm to remove a problem.
              </p>
            </div>

            {/* Guide Card 3: Test Cases & Grading */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                3. Sample vs Hidden Test Cases
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                • <strong>Sample Test Cases:</strong> Visible to students in the Code Studio to test during coding.<br />
                • <strong>Hidden Test Cases:</strong> Protected on the server; students cannot inspect these. Used for final grading when clicking "Submit Code" to award career points and prevent cheating.
              </p>
            </div>

            {/* Guide Card 4: Maintenance Mode */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                4. Activating Maintenance Mode
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                During scheduled syllabus upgrades or exam paper uploads, proactively show a friendly maintenance screen:
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200">
                In server/.env set: <span className="text-rose-400 font-bold">MAINTENANCE_MODE=true</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Students will see an in-app "Back in 10 minutes" screen. Set back to <code>false</code> when done.
              </p>
            </div>

            {/* Guide Card 5: Scale to 1,000 Concurrent Students */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-purple-400 flex items-center gap-1.5">
                5. Handling 1,000+ Concurrent Students
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                • Run with PM2 in cluster mode across all CPU cores: <code>pm2 start index.js -i max</code>.<br />
                • The backend has rate-limiting enabled in <code>middleware/rateLimiter.js</code> to prevent server crashes from rapid compilation requests.
              </p>
            </div>

            {/* Guide Card 6: Database & Atlas */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                6. MongoDB Atlas Cloud Deployment
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Add your MongoDB Atlas connection string in <code>server/.env</code>:
              </p>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 truncate">
                MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/procode
              </div>
              <p className="text-[11px] text-slate-400">
                ProCode runs seamlessly in high-speed local store mode if MONGODB_URI is not provided.
              </p>
            </div>

            {/* Guide Card 7: Engineering Branches & Section Customization */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
                7. Engineering Branches &amp; Section Management
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                All college branches (CSE, AI &amp; ML, Data Science, Cyber Security, IT, ECE, ELCE/EEE, EE, Mechanical, Civil, Chemical/Biotech) are available across student registration, profile editing, and leaderboard filtering. You can customize them anytime in <code>client/src/constants/branches.js</code>.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* EDIT MODAL */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 size={16} className="text-amber-400" /> Edit: {editingProblem.title}
              </h3>
              <button onClick={() => setEditingProblem(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Title</label>
                  <input required value={editingProblem.title} onChange={e => setEditingProblem({...editingProblem, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Topic</label>
                  <select value={editingProblem.topic} onChange={e => setEditingProblem({...editingProblem, topic: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white">
                    {topics.filter(t=>t!=='All').map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Difficulty &amp; Points</label>
                  <select value={editingProblem.difficulty} onChange={e => setEditingProblem({...editingProblem, difficulty: e.target.value, points: e.target.value==='Easy'?10:e.target.value==='Medium'?25:50})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white">
                    <option value="Easy">Easy (10 pts)</option>
                    <option value="Medium">Medium (25 pts)</option>
                    <option value="Hard">Hard (50 pts)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Exam Citation</label>
                  <input value={editingProblem.collegeExamReference || ''} onChange={e => setEditingProblem({...editingProblem, collegeExamReference: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Constraints</label>
                <input value={editingProblem.constraints || ''} onChange={e => setEditingProblem({...editingProblem, constraints: e.target.value})} placeholder="e.g. 1 <= N <= 10^5" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Problem Description</label>
                <textarea rows={3} required value={editingProblem.description} onChange={e => setEditingProblem({...editingProblem, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
              </div>

              {/* Sample Test Case */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Sample Test Case (Visible to Students)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Input</label>
                    <textarea rows={2} value={editingProblem.sampleInput || ''} onChange={e => setEditingProblem({...editingProblem, sampleInput: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Expected Output</label>
                    <textarea rows={2} value={editingProblem.sampleOutput || ''} onChange={e => setEditingProblem({...editingProblem, sampleOutput: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono" />
                  </div>
                </div>
              </div>

              {/* Hidden Test Case */}
              <div className="p-3 bg-slate-950 rounded-xl border border-rose-950/40 space-y-2">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">Hidden Test Case (Judge Scoring - Protected)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Hidden Input</label>
                    <textarea rows={2} value={editingProblem.hiddenInput || ''} onChange={e => setEditingProblem({...editingProblem, hiddenInput: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Hidden Expected Output</label>
                    <textarea rows={2} value={editingProblem.hiddenOutput || ''} onChange={e => setEditingProblem({...editingProblem, hiddenOutput: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="eGrad" checked={Boolean(editingProblem.isGraduationProblem)} onChange={e => setEditingProblem({...editingProblem, isGraduationProblem: e.target.checked})} />
                <label htmlFor="eGrad" className="text-xs text-slate-300 cursor-pointer">Mark as Topic Graduation Problem</label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => { setEditingProblem(null); if (onClearInitialEditingProblem) onClearInitialEditingProblem(); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
