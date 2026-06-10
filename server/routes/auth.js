const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const auth = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretoutreachaijwtkey123!';

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    const checkUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (checkUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password (sync to avoid Express 5 async issues)
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);
    const createdAt = new Date().toISOString();

    // Insert user
    const insertStmt = db.prepare(`
      INSERT INTO users (email, password_hash, subscription_tier, emails_used, created_at)
      VALUES (?, ?, 'free', 0, ?)
    `);
    const info = insertStmt.run(email, passwordHash, createdAt);
    const userId = info.lastInsertRowid;

    // Get the newly created user
    const user = {
      id: Number(userId),
      email,
      subscription_tier: 'free',
      emails_used: 0,
      created_at: createdAt
    };

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password (sync to avoid Express 5 async issues)
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Clean user object for response
    const safeUser = {
      id: user.id,
      email: user.email,
      subscription_tier: user.subscription_tier,
      emails_used: user.emails_used,
      created_at: user.created_at
    };

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    return res.json({ token, user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
