const express = require('express');
const router = express.Router();
const { Note } = require('../services/db');

// List notes with optional filter by unit/topic/subject
router.get('/', async (req, res) => {
  try {
    const { unit, topic, search } = req.query;
    let notes = await Note.find({});

    if (unit && unit !== 'All') {
      notes = notes.filter(n => n.unit === unit);
    }
    if (topic && topic !== 'All') {
      notes = notes.filter(n => n.topic.toLowerCase() === topic.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      notes = notes.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q) ||
        (n.collegeExamTip && n.collegeExamTip.toLowerCase().includes(q))
      );
    }

    res.json({ notes, total: notes.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// Single note details
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Concept note not found.' });
    res.json({ note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load concept note.' });
  }
});

module.exports = router;
