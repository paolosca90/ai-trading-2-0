// 🚀 AI Trading 2.0 - Simple CORS Proxy for Supabase Integration
// Since you already have Supabase set up, this just provides CORS support

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for Render frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://ai-trading-2-0-2.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// Health check for Render monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple endpoint to provide config info if needed
app.get('/config', (req, res) => {
  res.json({
    supabaseUrl:'[REDACTED]',  // Your existing Supabase URL
    frontendUrl: process.env.FRONTEND_URL || 'https://ai-trading-2-0-2.onrender.com'
  });
});

// CORS proxy for any additional API calls if needed
app.use('/api/*', async (req, res) => {
  // Could proxy to Supabase or other services if needed
  res.json({ message: 'CORS proxy active' });
});

// SPA fallback - serve index.html for client-side routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 AI Trading 2.0 Simple Server');
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`🔌 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('✅ Using your existing Supabase setup!');
  console.log('📡 CORS enabled for Supabase integration');
});

module.exports = app;