const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from root and public directory
app.use(express.static('.'));
app.use(express.static('public'));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 AI Trading 2.0 server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
});