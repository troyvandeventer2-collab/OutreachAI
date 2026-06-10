const jwt = require('jsonwebtoken');
const db = require('../db/database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretoutreachaijwtkey123!';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token error' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch the latest user record to ensure it is valid and up-to-date
    const stmt = db.prepare('SELECT id, email, subscription_tier, emails_used, created_at FROM users WHERE id = ?');
    const user = stmt.get(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
