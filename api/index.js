const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const db = require('../server/db/database');
const authRoutes = require('../server/routes/auth');
const generateRoutes = require('../server/routes/generate');
const paymentRoutes = require('../server/routes/payment');
const userRoutes = require('../server/routes/user');

const app = express();

// Serve built frontend
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'OutreachAI Backend Server is running.' });
});

app.use((req, res) => {
  if (req.path.startsWith('/api/') || req.path === '/health') return;
  res.sendFile(path.join(clientDist, 'index.html'));
});

module.exports = app;
