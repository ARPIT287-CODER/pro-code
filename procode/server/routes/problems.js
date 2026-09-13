const express = require('express');
const router = express.Router();
const { Problem } = require('../services/db');
const { optionalAuth } = require('../middleware/auth');

// Get all problems with optional filters & user solved status
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { topic, difficulty, search } = req.query;
    let problems = await Problem.find({});

    if (topic && topic !== 'All') {
      problems = problems.filter(p => p.topic.toLowerCase() === topic.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      problems = problems.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        (p.examUnit && p.examUnit.toLowerCase().includes(q))
      );
    }

    const solvedSet = new Set(req.user?.solvedProblems || []);

    const sanitized = problems.map(p => {
      const { hiddenTestCases, starterCode, ...rest } = p;
      return {
        ...rest,
        isSolved: solvedSet.has(p._id)
      };
    });

    res.json({ problems: sanitized, total: sanitized.length });
  } catch (err) {
    console.error('Error fetching problems:', err);
    res.status(500).json({ error: 'Failed to fetch problems.' });
  }
});

// Topic ladder view (organized by topic, progressive easy -> hard, with graduation markers)
router.get('/ladder', optionalAuth, async (req, res) => {
  try {
    const allProblems = await Problem.find({});
    const solvedSet = new Set(req.user?.solvedProblems || []);

    const topicsOrder = [
      'Arrays',
      'Strings',
      'Recursion',
      'Searching',
      'Sorting',
      'Linked Lists',
      'Stacks/Queues',
      'Basic Trees'
    ];

    const difficultyWeight = { Easy: 1, Medium: 2, Hard: 3 };

    const grouped = {};
    for (const t of topicsOrder) {
      grouped[t] = [];
    }

    for (const p of allProblems) {
      const { hiddenTestCases, starterCode, ...rest } = p;
      const topicName = p.topic || 'General';
      if (!grouped[topicName]) grouped[topicName] = [];
      grouped[topicName].push({
        ...rest,
        isSolved: solvedSet.has(p._id)
      });
    }

    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => (difficultyWeight[a.difficulty] || 1) - (difficultyWeight[b.difficulty] || 1));
    }

    res.json({ ladder: grouped });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load topic ladder.' });
  }
});

// Get single problem by ID (includes sampleTestCases, starterCode, LeetCode graduation info)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    const { hiddenTestCases, ...safeProblem } = problem;
    const isSolved = req.user ? (req.user.solvedProblems || []).includes(problem._id) : false;

    res.json({
      problem: {
        ...safeProblem,
        isSolved,
        totalHiddenCount: (hiddenTestCases || []).length
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problem details.' });
  }
});

module.exports = router;
