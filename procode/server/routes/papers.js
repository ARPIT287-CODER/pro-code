const express = require('express');
const router = express.Router();
const { Paper } = require('../services/db');

// List past papers with filters (year, examType, subject, search)
router.get('/', async (req, res) => {
  try {
    const { year, examType, subject, search } = req.query;
    let papers = await Paper.find({});

    if (year && year !== 'All') {
      papers = papers.filter(p => String(p.year) === String(year));
    }
    if (examType && examType !== 'All') {
      papers = papers.filter(p => p.examType.toLowerCase() === examType.toLowerCase());
    }
    if (subject && subject !== 'All') {
      papers = papers.filter(p => p.subject.toLowerCase() === subject.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      papers = papers.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.courseCode.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.topicsCovered && p.topicsCovered.some(t => t.toLowerCase().includes(q)))
      );
    }

    papers.sort((a, b) => (b.year || 0) - (a.year || 0));

    res.json({ papers, total: papers.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch previous year papers.' });
  }
});

// Single paper detail
router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Paper not found.' });
    res.json({ paper });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load paper.' });
  }
});

module.exports = router;
