const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Log API URL for debugging
console.log(`Backend API URL: ${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}`);

// Serve index.html for all routes (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'frontend', 'build')}`);
  console.log(`🔗 Backend: ${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}`);
});
