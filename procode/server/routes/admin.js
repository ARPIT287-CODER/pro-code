const express = require('express');
const router = express.Router();
const { Problem, Paper, Note, Report, User } = require('../services/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public or student route to report suspected cheating
router.post('/report-cheat', authenticateToken, async (req, res) => {
  try {
    const { targetUserId, targetUserName, problemId, reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Please provide reason for suspected cheating.' });
    }

    const report = await Report.create({
      reporterId: req.user._id,
      reporterName: req.user.name,
      targetUserId,
      targetUserName,
      problemId,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Cheating report submitted for faculty review. Thank you for keeping ProCode fair.', reportId: report._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit cheat report.' });
  }
});

// --- ADMIN ONLY ROUTES ---
router.use(authenticateToken, requireAdmin);

// Get all problems with FULL details (including hidden test cases for editing)
router.get('/problems', async (req, res) => {
  try {
    const problems = await Problem.find({});
    res.json({ problems, total: problems.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problems for administration.' });
  }
});

// Add new problem
router.post('/problems', async (req, res) => {
  try {
    const {
      title, topic, difficulty, points, examUnit, collegeExamReference,
      description, constraints, inputFormat, outputFormat,
      sampleTestCases, hiddenTestCases, starterCode,
      isGraduationProblem, leetcodeUrl, suggestedLeetcode
    } = req.body;

    if (!title || !topic || !description) {
      return res.status(400).json({ error: 'Title, topic, and description are required.' });
    }

    const problem = await Problem.create({
      title: title.trim(),
      topic: topic.trim(),
      difficulty: difficulty || 'Easy',
      points: Number(points) || 10,
      examUnit: examUnit || 'Unit 1: Linear Data Structures',
      collegeExamReference: collegeExamReference || '',
      description: description.trim(),
      constraints: constraints || '',
      inputFormat: inputFormat || '',
      outputFormat: outputFormat || '',
      sampleTestCases: sampleTestCases || [],
      hiddenTestCases: hiddenTestCases || [],
      starterCode: starterCode || {},
      isGraduationProblem: Boolean(isGraduationProblem),
      leetcodeUrl: leetcodeUrl || '',
      suggestedLeetcode: suggestedLeetcode || []
    });

    res.status(201).json({ message: 'Problem created successfully.', problem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create problem.' });
  }
});

// Update problem
router.put('/problems/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.points) updateData.points = Number(updateData.points);
    if (updateData.isGraduationProblem !== undefined) updateData.isGraduationProblem = Boolean(updateData.isGraduationProblem);

    const updated = await Problem.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Problem not found.' });
    res.json({ message: 'Problem updated successfully.', problem: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update problem.' });
  }
});

// Delete problem
router.delete('/problems/:id', async (req, res) => {
  try {
    const result = await Problem.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Problem not found.' });
    res.json({ message: 'Problem deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete problem.' });
  }
});

// Add previous year paper
router.post('/papers', async (req, res) => {
  try {
    const paper = await Paper.create(req.body);
    res.status(201).json({ message: 'Paper added successfully.', paper });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add paper.' });
  }
});

// Add concept note
router.post('/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json({ message: 'Concept note added successfully.', note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add note.' });
  }
});

// View cheat reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find({});
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});

// Overview statistics for Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalProblems = await Problem.countDocuments();
    const totalPapers = await Paper.countDocuments();
    const totalNotes = await Note.countDocuments();
    const totalReports = await Report.countDocuments();

    res.json({
      totalUsers,
      totalProblems,
      totalPapers,
      totalNotes,
      totalReports
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
});

module.exports = router;
