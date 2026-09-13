function maintenanceMiddleware(req, res, next) {
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';

  // Allow health checks even during maintenance
  if (req.path === '/api/health') {
    return next();
  }

  if (isMaintenance) {
    return res.status(503).json({
      error: 'Service Unavailable',
      maintenance: true,
      message: 'ProCode is currently undergoing scheduled maintenance and updates. We will be back shortly in approximately 10 minutes.',
      estimatedEndTime: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });
  }

  next();
}

module.exports = maintenanceMiddleware;
