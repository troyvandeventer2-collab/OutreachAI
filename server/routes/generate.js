const express = require('express');
const db = require('../db/database');
const auth = require('../middleware/auth');
const { generateEmails } = require('../utils/emailTemplates');

const router = express.Router();

// POST /api/generate
router.post('/', auth, (req, res) => {
  const { user_name, prospect_name, prospect_company, prospect_title, what_they_sell } = req.body;

  // Validation
  if (!user_name || !prospect_name || !prospect_company || !prospect_title || !what_they_sell) {
    return res.status(400).json({
      error: 'All fields are required: user_name, prospect_name, prospect_company, prospect_title, what_they_sell'
    });
  }

  try {
    const user = req.user;

    // Check usage limits for free tier
    if (user.subscription_tier === 'free' && user.emails_used >= 3) {
      return res.status(403).json({
        error: 'Free tier limit reached. You have used your 3 free generations. Please upgrade to the Paid tier for unlimited access.'
      });
    }

    // Generate the emails using our templates
    const [opener, followup, breakup] = generateEmails({
      user_name,
      prospect_name,
      prospect_company,
      prospect_title,
      what_they_sell
    });

    // Store generation in database
    const insertGeneration = db.prepare(`
      INSERT INTO generations (
        user_id, user_name, prospect_name, prospect_company, prospect_title, what_they_sell,
        email_opener, email_followup, email_breakup, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const createdAt = new Date().toISOString();
    insertGeneration.run(
      user.id,
      user_name,
      prospect_name,
      prospect_company,
      prospect_title,
      what_they_sell,
      opener,
      followup,
      breakup,
      createdAt
    );

    // If user is on the free tier, increment their usage count
    if (user.subscription_tier === 'free') {
      const updateUserUsage = db.prepare('UPDATE users SET emails_used = emails_used + 1 WHERE id = ?');
      updateUserUsage.run(user.id);
    }

    return res.status(200).json({
      emails: [opener, followup, breakup]
    });
  } catch (error) {
    console.error('Email generation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
