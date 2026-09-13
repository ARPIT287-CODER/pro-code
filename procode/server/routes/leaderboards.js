const express = require('express');
const router = express.Router();
const { User, Submission } = require('../services/db');

// 1. Career Leaderboard (Lifetime, never resets)
router.get('/career', async (req, res) => {
  try {
    const { batch } = req.query;
    let users = await User.find({ role: 'student' });

    if (batch && batch !== 'All') {
      users = users.filter(u => u.batch === batch);
    }

    users.sort((a, b) => (b.careerPoints || 0) - (a.careerPoints || 0));

    const leaderboard = users.map((u, index) => ({
      rank: index + 1,
      userId: u._id,
      name: u.name,
      alias: u.alias || u.name,
      batch: u.batch,
      points: u.careerPoints || 0,
      rankTier: u.rankTier || 'Bronze',
      solvedCount: (u.solvedProblems || []).length,
      avatar: u.avatar
    }));

    res.json({ leaderboard, total: leaderboard.length });
  } catch (err) {
    console.error('Career leaderboard error:', err);
    res.status(500).json({ error: 'Failed to fetch career leaderboard.' });
  }
});

// 2. Daily Leaderboard (Points earned in past 24 hours)
router.get('/daily', async (req, res) => {
  try {
    const { batch } = req.query;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const submissions = await Submission.find({});
    const recentSubs = submissions.filter(s => s.createdAt >= since && s.status === 'Accepted');

    // Aggregate by user
    const pointsMap = {};
    for (const sub of recentSubs) {
      if (!pointsMap[sub.userId]) {
        pointsMap[sub.userId] = {
          points: 0,
          solvedCount: 0,
          userName: sub.userName,
          userBatch: sub.userBatch,
          userAlias: sub.userAlias
        };
      }
      pointsMap[sub.userId].points += (sub.pointsAwarded || 0);
      pointsMap[sub.userId].solvedCount += 1;
    }

    let users = await User.find({ role: 'student' });
    if (batch && batch !== 'All') {
      users = users.filter(u => u.batch === batch);
    }

    const leaderboard = users
      .map(u => {
        const stats = pointsMap[u._id] || { points: 0, solvedCount: 0 };
        return {
          userId: u._id,
          name: u.name,
          alias: u.alias || u.name,
          batch: u.batch,
          points: stats.points,
          solvedCount: stats.solvedCount,
          rankTier: u.rankTier || 'Bronze',
          avatar: u.avatar
        };
      })
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    res.json({ leaderboard, total: leaderboard.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daily leaderboard.' });
  }
});

// 3. Weekly Leaderboard (Points earned since last Monday 00:00)
router.get('/weekly', async (req, res) => {
  try {
    const { batch } = req.query;
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diffToMonday));
    monday.setHours(0, 0, 0, 0);
    const since = monday.toISOString();

    const submissions = await Submission.find({});
    const weekSubs = submissions.filter(s => s.createdAt >= since && s.status === 'Accepted');

    const pointsMap = {};
    for (const sub of weekSubs) {
      if (!pointsMap[sub.userId]) {
        pointsMap[sub.userId] = { points: 0, solvedCount: 0 };
      }
      pointsMap[sub.userId].points += (sub.pointsAwarded || 0);
      pointsMap[sub.userId].solvedCount += 1;
    }

    let users = await User.find({ role: 'student' });
    if (batch && batch !== 'All') {
      users = users.filter(u => u.batch === batch);
    }

    const leaderboard = users
      .map(u => {
        const stats = pointsMap[u._id] || { points: 0, solvedCount: 0 };
        return {
          userId: u._id,
          name: u.name,
          alias: u.alias || u.name,
          batch: u.batch,
          points: stats.points,
          solvedCount: stats.solvedCount,
          rankTier: u.rankTier || 'Bronze',
          avatar: u.avatar
        };
      })
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    res.json({ leaderboard, total: leaderboard.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weekly leaderboard.' });
  }
});

module.exports = router;
