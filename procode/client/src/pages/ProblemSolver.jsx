import React, { useState, useEffect } from 'react';
import { Terminal, Play, Send, RotateCcw, CheckCircle2, XCircle, Clock, Cpu, ExternalLink, ArrowLeft, Award, Sparkles, BookOpen, AlertCircle, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import TierBadge from '../components/TierBadge';

export default function ProblemSolver({ problemId, onBack, user, onOpenAuth, onPointsUpdated }) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [activeLeftTab, setActiveLeftTab] = useState('description'); // 'description', 'leetcode', 'submissions'
  const [activeRightTab, setActiveRightTab] = useState('testcases'); // 'testcases', 'results'
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchProblemDetails();
  }, [problemId]);

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('procode_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/problems/${problemId}`, { headers });
      const data = await res.json();
      if (data.problem) {
        setProblem(data.problem);
        // Set starter code for default language
        const starter = data.problem.starterCode?.[language] || getDefaultStarter(language);
        setCode(starter);
      }
    } catch (err) {
      console.error('Failed to fetch problem:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem && problem.starterCode && problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    } else {
      setCode(getDefaultStarter(newLang));
    }
  };

  const getDefaultStarter = (lang) => {
    switch (lang) {
      case 'c': return '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}';
      case 'cpp': return '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}';
      case 'java': return 'import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}';
      case 'python': return 'import sys\n\ndef main():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    main()';
      default: return '';
    }
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to initial boilerplate template?')) {
      const starter = problem?.starterCode?.[language] || getDefaultStarter(language);
      setCode(starter);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveRightTab('results');
    setRunResults(null);

    try {
      const res = await fetch('/api/submissions/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          language,
          code,
          customInput: customInput.trim() || undefined
        })
      });
      const data = await res.json();
      setRunResults(data);
    } catch (err) {
      setRunResults({
        status: 'Error',
        error: 'Failed to contact execution server.'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    setActiveRightTab('results');
    setRunResults(null);

    try {
      const token = localStorage.getItem('procode_token');
      const res = await fetch('/api/submissions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId,
          language,
          code
        })
      });

      const data = await res.json();
      setRunResults(data);

      if (data.status === 'Accepted') {
        // Confetti celebration
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });

        setSubmissionFeedback({
          pointsAwarded: data.pointsAwarded,
          alreadySolved: data.alreadySolved,
          newCareerPoints: data.newCareerPoints,
          newTier: data.newTier,
          suggestedLeetcode: data.suggestedLeetcode,
          leetcodeUrl: data.leetcodeUrl,
          isGraduation: data.isGraduationProblem
        });

        if (onPointsUpdated) {
          onPointsUpdated({ careerPoints: data.newCareerPoints, rankTier: data.newTier });
        }
      }
    } catch (err) {
      setRunResults({
        status: 'Error',
        error: 'Failed to submit code.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !problem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Loading Problem Workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 sm:px-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{problem.title}</h2>
              {problem.isSolved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={12} /> Solved
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {problem.topic} &bull; <span className="text-amber-400 font-semibold">{problem.difficulty}</span> &bull; {problem.points} Points
            </p>
          </div>
        </div>

        {/* Language selector & code actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            {['c', 'cpp', 'java', 'python'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg uppercase transition cursor-pointer ${
                  language === lang
                    ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'cpp' ? 'C++' : lang}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            title="Copy Code"
            className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl transition cursor-pointer"
          >
            {copiedCode ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>

          <button
            onClick={handleResetCode}
            title="Reset to Starter Template"
            className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl transition cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Workspace (Split Grid on Desktop, Stacked on Mobile per Roadmap 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Problem Details & LeetCode Bridge (Desktop: 5 cols, Mobile: full) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[500px] max-h-[750px]">
          {/* Left Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition cursor-pointer ${
                activeLeftTab === 'description'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Description &amp; Syllabus
            </button>
            <button
              onClick={() => setActiveLeftTab('leetcode')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeLeftTab === 'leetcode'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ExternalLink size={13} />
              LeetCode Bridge
            </button>
          </div>

          {/* Left Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-300 text-sm">
            {activeLeftTab === 'description' ? (
              <>
                {/* College Exam Citation Tag */}
                {problem.collegeExamReference && (
                  <div className="p-3.5 bg-blue-950/40 border border-blue-900/40 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-blue-300 flex items-center gap-1.5">
                      🎓 College Exam Mapping
                    </p>
                    <p className="text-slate-300">{problem.collegeExamReference}</p>
                    <p className="text-[11px] text-blue-400/80 font-mono">{problem.examUnit}</p>
                  </div>
                )}

                {/* Problem Statement */}
                <div>
                  <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-2">Problem Statement</h4>
                  <p className="leading-relaxed whitespace-pre-line text-slate-200">{problem.description}</p>
                </div>

                {/* Constraints */}
                {problem.constraints && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-2">Constraints</h4>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300/90 whitespace-pre-line">
                      {problem.constraints}
                    </div>
                  </div>
                )}

                {/* Input / Output Format */}
                {(problem.inputFormat || problem.outputFormat) && (
                  <div className="space-y-3">
                    {problem.inputFormat && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-1">Input Format</h4>
                        <p className="text-xs text-slate-300 whitespace-pre-line">{problem.inputFormat}</p>
                      </div>
                    )}
                    {problem.outputFormat && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-1">Output Format</h4>
                        <p className="text-xs text-slate-300 whitespace-pre-line">{problem.outputFormat}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Sample Test Cases */}
                <div>
                  <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-2">Sample Test Cases</h4>
                  <div className="space-y-3">
                    {(problem.sampleTestCases || []).map((stc, idx) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center text-slate-400 text-[11px]">
                          <span>Sample Case {idx + 1}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Input:</span>
                          <pre className="text-slate-200 bg-slate-900 p-2 rounded-lg">{stc.input}</pre>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Expected Output:</span>
                          <pre className="text-amber-400 bg-slate-900 p-2 rounded-lg">{stc.expectedOutput}</pre>
                        </div>
                        {stc.explanation && (
                          <div className="text-[11px] text-slate-400 font-sans mt-1">
                            <span className="font-semibold text-slate-300">Explanation:</span> {stc.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* LeetCode Bridge Tab */
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-900/50 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Award size={18} />
                    <span>College-to-Placement Bridge</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Once you master this university syllabus problem, test yourself against the exact industry standard on LeetCode!
                  </p>
                  {problem.leetcodeUrl && (
                    <a
                      href={problem.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
                    >
                      <span>Open Equivalent on LeetCode</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {/* Suggested Follow-Ups */}
                <div>
                  <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-3">
                    Recommended LeetCode Follow-Ups (Easy &rarr; Medium)
                  </h4>
                  <div className="space-y-2.5">
                    {(problem.suggestedLeetcode || []).map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-200 group-hover:text-amber-400 transition">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            item.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                          }`}>
                            {item.difficulty}
                          </span>
                          <ExternalLink size={13} className="text-slate-500 group-hover:text-amber-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Studio & Execution Console (Desktop: 7 cols, Mobile: full) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[500px]">
          {/* Code Editor Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal size={14} className="text-amber-400" />
              <span>solution.{language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language === 'java' ? 'java' : 'py'}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Auto-Indent</span>
              <span className="text-slate-600">&bull;</span>
              <span>Sandboxed Runner</span>
            </div>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="relative flex-1 bg-slate-950/90 font-mono text-xs min-h-[300px]">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[320px] bg-slate-950 text-slate-100 p-4 font-mono text-xs sm:text-sm resize-none focus:outline-none leading-relaxed border-none selection:bg-blue-600/30"
              placeholder="// Write your C / C++ / Java / Python solution here..."
            />
          </div>

          {/* Output & Test Runner Tabs */}
          <div className="border-t border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/50">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveRightTab('testcases')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    activeRightTab === 'testcases' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveRightTab('results')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeRightTab === 'results' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Execution Output</span>
                  {runResults && (
                    <span className={`w-2 h-2 rounded-full ${runResults.status === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  )}
                </button>
              </div>

              {/* Bottom Buttons: Run & Submit */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <Play size={13} className={isRunning ? 'animate-spin' : 'text-emerald-400'} />
                  <span>{isRunning ? 'Running...' : 'Run Cases'}</span>
                </button>

                <button
                  onClick={handleSubmitSolution}
                  disabled={isRunning || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 transition cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} className={isSubmitting ? 'animate-pulse' : ''} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Code'}</span>
                </button>
              </div>
            </div>

            {/* Testcases or Output Body */}
            <div className="p-4 max-h-56 overflow-y-auto text-xs font-mono">
              {activeRightTab === 'testcases' ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {(problem.sampleTestCases || []).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIdx(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                          selectedTestCaseIdx === idx ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedTestCaseIdx(-1)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                        selectedTestCaseIdx === -1 ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Custom Input
                    </button>
                  </div>

                  {selectedTestCaseIdx >= 0 && problem.sampleTestCases?.[selectedTestCaseIdx] ? (
                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Input:</span>
                        <pre className="p-2 bg-slate-900 rounded-lg text-slate-300">{problem.sampleTestCases[selectedTestCaseIdx].input}</pre>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Expected:</span>
                        <pre className="p-2 bg-slate-900 rounded-lg text-amber-400">{problem.sampleTestCases[selectedTestCaseIdx].expectedOutput}</pre>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-slate-400 text-[11px] block mb-1">Enter custom standard input (stdin):</span>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="e.g. 5&#10;1 2 3 4 5"
                        className="w-full h-20 bg-slate-900 p-2 text-slate-100 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400 font-mono text-xs"
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Results View */
                <div>
                  {!runResults ? (
                    <div className="text-slate-500 text-center py-6">
                      Click "Run Cases" to test your sample cases or "Submit Code" to evaluate against hidden grading cases.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Status Summary Banner */}
                      <div className={`p-3 rounded-xl flex items-center justify-between ${
                        runResults.status === 'Accepted'
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                      }`}>
                        <div className="flex items-center gap-2">
                          {runResults.status === 'Accepted' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                          <span className="font-bold text-sm">{runResults.status}</span>
                          <span className="text-slate-400 font-sans text-xs">
                            ({runResults.passedCount} / {runResults.totalCount} Test Cases Passed)
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-sans text-slate-300">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {runResults.runtime || 15} ms
                          </span>
                          <span className="flex items-center gap-1">
                            <Cpu size={12} /> {Math.round((runResults.memory || 14000) / 1024)} MB
                          </span>
                        </div>
                      </div>

                      {/* Error details if any */}
                      {runResults.error && (
                        <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-rose-300 text-xs">
                          {runResults.error}
                        </div>
                      )}

                      {/* Case by case breakdown */}
                      <div className="space-y-2">
                        {(runResults.results || []).map((res, i) => (
                          <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-300 font-semibold">Test Case #{res.caseNumber || i + 1}</span>
                              <span className={res.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}>
                                {res.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              <div>
                                <span className="text-slate-500">Expected:</span>
                                <div className="text-amber-400 truncate">{res.expected}</div>
                              </div>
                              <div>
                                <span className="text-slate-500">Output:</span>
                                <div className={res.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400 truncate'}>
                                  {res.actual || '(no output)'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Celebration Modal when Solved */}
      {submissionFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <Sparkles size={32} />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Challenge Solved! 🎉</h3>
              <p className="text-slate-400 text-sm mt-1">
                {submissionFeedback.alreadySolved
                  ? "Great practice! You've already earned points for this problem."
                  : `Congratulations! You earned +${submissionFeedback.pointsAwarded} career points!`}
              </p>
            </div>

            {/* Points & Tier Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-around">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-mono">Total Points</p>
                <p className="text-xl font-black text-amber-400 font-mono">{submissionFeedback.newCareerPoints} pts</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-mono">Rank Tier</p>
                <div className="mt-1">
                  <TierBadge tier={submissionFeedback.newTier} size="xs" />
                </div>
              </div>
            </div>

            {/* LeetCode Follow-up recommendation */}
            {submissionFeedback.leetcodeUrl && (
              <div className="p-4 bg-indigo-950/40 border border-indigo-900/40 rounded-2xl text-left space-y-2">
                <p className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  🚀 Ready for the Next Step?
                </p>
                <p className="text-xs text-slate-300">
                  Graduate from college-ready to placement-ready with the equivalent LeetCode challenge:
                </p>
                <a
                  href={submissionFeedback.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  Solve on LeetCode <ExternalLink size={12} />
                </a>
              </div>
            )}

            <button
              onClick={() => setSubmissionFeedback(null)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition cursor-pointer"
            >
              Continue Practicing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
