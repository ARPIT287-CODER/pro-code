require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB, isMongo, User, Problem, Note, Paper, Submission, Report } = require('./services/db');
const { seedDatabase } = require('./services/seedData');
const maintenanceMiddleware = require('./middleware/maintenance');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const submissionRoutes = require('./routes/submissions');
const leaderboardRoutes = require('./routes/leaderboards');
const noteRoutes = require('./routes/notes');
const paperRoutes = require('./routes/papers');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Global process exception safety (Defensive Reliability - Roadmap 8.2)
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception caught safely:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Promise Rejection caught safely:', reason);
});

// Middleware stack
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);
app.use(maintenanceMiddleware);

// Serve Client Static Production Build if present
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
}

// PDF Direct Download & Browser Viewer Endpoints
const PDF_PATH = path.join(__dirname, '..', 'docs', 'ProCode_Documentation_and_Guide.pdf');
app.get('/download-pdf', (req, res) => {
  if (fs.existsSync(PDF_PATH)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="ProCode_Documentation_and_Guide.pdf"');
    res.sendFile(PDF_PATH);
  } else {
    res.status(404).send('PDF document is currently generating. Please retry in 10 seconds.');
  }
});
app.get('/docs/ProCode_Documentation_and_Guide.pdf', (req, res) => {
  if (fs.existsSync(PDF_PATH)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="ProCode_Documentation_and_Guide.pdf"');
    res.sendFile(PDF_PATH);
  } else {
    res.status(404).send('PDF not found.');
  }
});

// Health check endpoint (Roadmap 9.2)
app.get('/api/health', async (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());

  res.json({
    status: 'ok',
    service: 'ProCode API Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeSeconds}s`,
    database: isMongo() ? 'MongoDB Atlas / Connected' : 'Local Persistent Storage Active',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/admin', adminRoutes);

// SPA fallback for frontend routing
app.get('*', (req, res) => {
  const indexPath = path.join(CLIENT_DIST, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      name: 'ProCode API Server',
      status: 'Online',
      description: 'Curriculum-Aligned College DSA Practice Platform'
    });
  }
});

// Global Error Handler Middleware (Roadmap 8.2 & 9.2)
app.use((err, req, res, next) => {
  console.error('Global Error Handler caught exception:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    requestId: req.headers['x-request-id'] || 'req_' + Date.now()
  });
});

// Initialize Database & Start Server
async function startServer() {
  await connectDB();
  await seedDatabase({ User, Problem, Note, Paper, Submission, Report });

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  🚀 ProCode Unified Server running on http://localhost:${PORT}`);
    console.log(`  📋 Health endpoint: http://localhost:${PORT}/api/health`);
    console.log(`  📄 PDF Viewer: http://localhost:${PORT}/download-pdf`);
    console.log(`  🛡️  Defensive reliability & rate-limiting enabled`);
    console.log(`=======================================================`);
  });
}

startServer();
