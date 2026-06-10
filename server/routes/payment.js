const express = require('express');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();
const BITCOIN_ADDRESS = 'bc1qs5jhsj3hnkapa9fhnzttupl65t3x00362xgk4a';

// POST /api/payment/verify
router.post('/verify', auth, (req, res) => {
  const { bitcoin_tx_id } = req.body;

  if (!bitcoin_tx_id || typeof bitcoin_tx_id !== 'string' || bitcoin_tx_id.trim() === '') {
    return res.status(400).json({ error: 'Bitcoin transaction ID is required' });
  }

  try {
    const user = req.user;

    // Update user's subscription tier and store the transaction ID
    const stmt = db.prepare(`
      UPDATE users 
      SET subscription_tier = 'paid', bitcoin_tx_id = ? 
      WHERE id = ?
    `);
    const result = stmt.run(bitcoin_tx_id.trim(), user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully. Your account has been upgraded to the Paid tier!',
      bitcoin_address: BITCOIN_ADDRESS,
      bitcoin_tx_id: bitcoin_tx_id.trim()
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/payment/info - helper endpoint to return the payment address and price
router.get('/info', auth, (req, res) => {
  return res.status(200).json({
    bitcoin_address: BITCOIN_ADDRESS,
    amount_usd: 19,
    subscription_tier: 'paid'
  });
});

module.exports = router;
