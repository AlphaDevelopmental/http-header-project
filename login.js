const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const SECRET_KEY = 'my-very-secret-key';
const SESSION_ID = '5u48p43c2piajum0e2ruu71vs1';

// Rate limiter
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: {
    error: 'Too many login attempts. Try again after 5 minutes.'
  }
});

// Login route
router.post('/', loginLimiter, (req, res) => {
  // Optional: Check credentials
  const { username, password } = req.body;
  if (username !== 'admin' || password !== 'pass123') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const payload = {
    sub: '1234',
    name: 'John',
    admin: true,
    "iat": 1718052023,
    "exp": 1718055623
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

  res.cookie('sessionid', SESSION_ID, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });

  res.json({
    message: 'Login successful. Use this token and cookie to access protected routes.',
    token: token
  });
});

module.exports = router;
// This code defines a login route that issues a JWT token and sets a session cookie.
// The route is protected by a rate limiter to prevent abuse.
// The JWT token contains user information and is signed with a secret key.
// The session cookie is set with security options to prevent XSS and CSRF attacks.
// The login route can be used to authenticate users and provide them with a token for accessing protected routes.
// This code defines an Express.js router that handles login requests.