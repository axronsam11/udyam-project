import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };

  res.json({
    success: true,
    data: healthCheck
  });
});

// GET /api/health/database - Database health check
router.get('/database', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const isHealthy = dbState === 1;

    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: {
        status: states[dbState as keyof typeof states],
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
