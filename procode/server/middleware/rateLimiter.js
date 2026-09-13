const rateLimit = require('express-rate-limit');

// General API limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// Strict limiter for code compilation/submission
const submissionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit to 20 code runs/submissions per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Execution rate limit exceeded. Please wait a moment before submitting again.' }
});

// Auth limiter for login/register to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many authentication attempts. Please try again later.' }
});

module.exports = {
  generalLimiter,
  submissionLimiter,
  authLimiter
};
