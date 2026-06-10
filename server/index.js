const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const db = require('./db/database'); // Ensure database initializes

const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve built frontend from client/dist
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// Enable CORS for all origins
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

// Serve React app for all other routes (client-side routing) - Express 5 compatible
app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Bind to 0.0.0.0 to ensure public availability
app.listen(PORT, '0.0.0.0', () => {
  console.log(`OutreachAI Backend Server is running and listening on http://0.0.0.0:${PORT}`);
});
