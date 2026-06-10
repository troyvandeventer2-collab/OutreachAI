const express = require('express');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/user/usage
router.get('/usage', auth, (req, res) => {
  try {
    const user = req.user;

    // Fetch total generations count
    const stmt = db.prepare('SELECT COUNT(*) as total FROM generations WHERE user_id = ?');
    const result = stmt.get(user.id);
    const totalGenerations = result ? result.total : 0;

    return res.status(200).json({
      emails_used: user.emails_used,
      subscription_tier: user.subscription_tier,
      total_generations: totalGenerations
    });
  } catch (error) {
    console.error('Usage retrieval error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/user/history
router.get('/history', auth, (req, res) => {
  try {
    const user = req.user;

    // Fetch history ordered by newest first
    const stmt = db.prepare('SELECT * FROM generations WHERE user_id = ? ORDER BY id DESC');
    const generations = stmt.all(user.id);

    return res.status(200).json({
      generations
    });
  } catch (error) {
    console.error('History retrieval error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
