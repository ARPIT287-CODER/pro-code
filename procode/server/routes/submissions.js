const express = require('express');
const router = express.Router();
const { Problem, User, Submission } = require('../services/db');
const { executeCode } = require('../services/judgeService');
const { calculateTier } = require('../services/seedData');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { submissionLimiter } = require('../middleware/rateLimiter');

// 1. Run Sample Test Cases (dry run, does not award points or save to leaderboard)
router.post('/run', submissionLimiter, async (req, res) => {
  try {
    const { problemId, language, code, customInput } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ error: 'problemId, language, and code are required.' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    const testCases = problem.sampleTestCases || [];
    const executionResult = await executeCode({
      language,
      code,
      testCases,
      customInput: customInput ? String(customInput) : undefined
    });

    res.json({
      success: executionResult.success,
      status: executionResult.status,
      passedCount: executionResult.passedCount,
      totalCount: executionResult.totalCount,
      runtime: executionResult.runtime,
      memory: executionResult.memory,
      results: executionResult.results,
      error: executionResult.error || null
    });
  } catch (err) {
    console.error('Run code error:', err);
    res.status(500).json({ error: 'Code execution engine encountered an error.' });
  }
});

// 2. Submit Solution for Grading & Points (evaluates against hidden test cases)
router.post('/submit', authenticateToken, submissionLimiter, async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ error: 'problemId, language, and code are required.' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    // Run against hidden test cases + sample test cases
    const allCases = [
      ...(problem.sampleTestCases || []),
      ...(problem.hiddenTestCases || [])
    ];

    const executionResult = await executeCode({
      language,
      code,
      testCases: allCases
    });

    const isAccepted = executionResult.status === 'Accepted';
    const user = await User.findById(req.user._id);

    const alreadySolved = (user.solvedProblems || []).includes(problemId);
    let pointsAwarded = 0;
    let newCareerPoints = user.careerPoints || 0;
    let newTier = user.rankTier || 'Bronze';

    if (isAccepted && !alreadySolved) {
      pointsAwarded = problem.points || 10;
      newCareerPoints += pointsAwarded;

      // Calculate new rank tier (no demotion)
      const calculatedTier = calculateTier(newCareerPoints);
      const tierRankOrder = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Conqueror'];
      const currentTierIndex = tierRankOrder.indexOf(user.rankTier || 'Bronze');
      const newTierIndex = tierRankOrder.indexOf(calculatedTier);
      newTier = newTierIndex > currentTierIndex ? calculatedTier : (user.rankTier || 'Bronze');

      await User.findByIdAndUpdate(user._id, {
        $set: {
          careerPoints: newCareerPoints,
          rankTier: newTier,
          solvedProblems: [...(user.solvedProblems || []), problemId]
        }
      });
    }

    // Save submission log
    const submissionRecord = await Submission.create({
      userId: user._id,
      userName: user.name,
      userBatch: user.batch,
      userAlias: user.alias,
      problemId: problem._id,
      problemTitle: problem.title,
      language,
      status: executionResult.status,
      runtime: executionResult.runtime || 15,
      memory: executionResult.memory || 14000,
      pointsAwarded,
      createdAt: new Date().toISOString()
    });

    // Provide detailed student-friendly feedback (hide sensitive raw hidden cases content)
    const sanitizedResults = (executionResult.results || []).map((r, i) => ({
      caseNumber: i + 1,
      status: r.status,
      time: r.time,
      memory: r.memory,
      isSample: i < (problem.sampleTestCases || []).length,
      input: i < (problem.sampleTestCases || []).length ? r.input : '[Hidden Test Case]',
      expected: i < (problem.sampleTestCases || []).length ? r.expected : '[Hidden Expected Output]',
      actual: i < (problem.sampleTestCases || []).length ? r.actual : (r.status === 'Accepted' ? '[Match]' : '[Mismatch]')
    }));

    res.json({
      success: isAccepted,
      status: executionResult.status,
      passedCount: executionResult.passedCount,
      totalCount: executionResult.totalCount,
      runtime: executionResult.runtime,
      memory: executionResult.memory,
      pointsAwarded,
      alreadySolved,
      newCareerPoints,
      newTier,
      results: sanitizedResults,
      submissionId: submissionRecord._id,
      suggestedLeetcode: isAccepted ? (problem.suggestedLeetcode || []) : [],
      leetcodeUrl: isAccepted ? problem.leetcodeUrl : null,
      isGraduationProblem: problem.isGraduationProblem || false
    });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Failed to process solution submission.' });
  }
});

// 3. User's submission history
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const subs = await Submission.find({ userId: req.user._id });
    subs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ submissions: subs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your submissions.' });
  }
});

// 4. Live public submissions feed
router.get('/live', async (req, res) => {
  try {
    const subs = await Submission.find({});
    subs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recent = subs.slice(0, 15).map(s => ({
      _id: s._id,
      userName: s.userAlias || s.userName,
      userBatch: s.userBatch,
      problemTitle: s.problemTitle,
      status: s.status,
      language: s.language,
      pointsAwarded: s.pointsAwarded,
      createdAt: s.createdAt
    }));
    res.json({ submissions: recent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live feed.' });
  }
});

module.exports = router;
