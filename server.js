const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

app.set('trust proxy', true); // Trust proxy for rate limiting is set to true, therefore enabling rate limiting even behind proxies

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP. Please try again later.' }
});

// Login-specific rate limiter
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  validate: false, // Disable automatic validation
  message: { error: 'Too many login attempts. Try again after 5 minutes.' },
  skip: (req) => {
    const whitelistedIP = '127.0.0.1';
    return req.ip === whitelistedIP;
  }
});

app.use(limiter);
app.use(express.json()); 
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const loginRoute = require('./login');
const protectedRoute = require('./protected');
const classwork1 = require('./classwork1');
const classwork2 = require('./classwork2');
const classwork3 = require('./classwork3');
const classwork4 = require('./classwork4');
const classwork5 = require('./classwork5');
const classwork6 = require('./classwork6');
const classwork7 = require('./classwork7');
const classwork8 = require('./classwork8');
const classwork9 = require('./classwork9');
const classwork10 = require('./classwork10');
const hintsRoute = require('./hints');

// Mount routes
app.use('/login', loginLimiter, loginRoute);
app.use('/protected', protectedRoute);
app.use('/hints', hintsRoute);

// Beginner challenges
app.use('/classwork1', classwork1);
app.use('/classwork2', classwork2);
app.use('/classwork3', classwork3);
app.use('/classwork4', classwork4);

// Intermediate challenges
app.use('/classwork5', classwork5);
app.use('/classwork6', classwork6);

// Advanced challenges
app.use('/classwork7', classwork7);
app.use('/classwork8', classwork8);

// Expert challenges
app.use('/classwork9', classwork9);
app.use('/classwork10', classwork10);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚩 Welcome to HTTP Header CTF Challenge!',
    version: '2.0',
    challenges: {
      beginner: {
        description: 'Learn HTTP basics',
        endpoints: [
          { path: '/classwork1', method: 'GET', concept: 'Headers & Methods' },
          { path: '/classwork2', method: 'POST', concept: 'API Keys & Body' },
          { path: '/classwork3', method: 'POST', concept: 'Multi-layer validation' },
          { path: '/classwork4', method: 'OPTIONS', concept: 'CORS Preflight' }
        ]
      },
      intermediate: {
        description: 'Authentication & Multiple Methods',
        endpoints: [
          { path: '/classwork5', methods: ['PUT', 'PATCH', 'DELETE'], concept: 'JWT + Cookies' },
          { path: '/classwork6', method: 'DELETE', concept: 'Full Auth Stack' }
        ]
      },
      advanced: {
        description: 'Complex Validation & Cryptography',
        endpoints: [
          { path: '/classwork7', method: 'OPTIONS', concept: 'Pattern Matching' },
          { path: '/classwork8', method: 'DELETE', concept: 'HMAC & Challenge-Response' }
        ]
      },
      expert: {
        description: 'Advanced Security Concepts',
        endpoints: [
          { path: '/classwork9', method: 'ANY', concept: 'Rate Limit Bypass' },
          { path: '/classwork10', method: 'POST', concept: 'Header Ordering' }
        ]
      }
    },
    resources: {
      login: '/login',
      protected: '/protected',
      hints: '/hints/:challenge'
    },
    quickStart: 'curl http://localhost:3000/classwork1 -H "Accept: application/json" -H "X-API-Version: v1"'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', hint: 'Check your request format' });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📚 View challenges at http://localhost:${port}/`);
  console.log(`💡 Get hints at http://localhost:${port}/hints/<challenge_number>`);
});

module.exports = app;
