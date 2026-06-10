const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db/database'); // Ensure database initializes

const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins in development
app.use(cors({
  origin: '*',
  credentials: true
}));

// Enable JSON and urlencoded request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register api routes
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);

// Root health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'OutreachAI Backend Server is running.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Bind to 0.0.0.0 to ensure public availability inside sandbox environment
app.listen(PORT, '0.0.0.0', () => {
  console.log(`OutreachAI Backend Server is running and listening on http://0.0.0.0:${PORT}`);
});
