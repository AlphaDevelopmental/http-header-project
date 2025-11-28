const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { SECRET_KEY, SESSION_ID, ADMIN_CREDENTIALS } = require('./config');

router.get('/', (req, res) => {
  res.json({
    message: 'Login endpoint. Send POST request with credentials.',
    format: { username: 'admin', password: 'pass123' },
    hint: 'Use Content-Type: application/json'
  });
});

router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return res.status(401).json({ 
      error: 'Invalid credentials',
      hint: 'Check the config file for valid credentials'
    });
  }

  const payload = {
    sub: '1234',
    name: username,
    admin: true,
    iat: Math.floor(Date.now() / 1000)
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

  res.cookie('sessionid', SESSION_ID, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });

  res.json({
    message: 'Login successful!',
    token: token,
    sessionId: SESSION_ID,
    expiresIn: '1 hour',
    usage: 'Use this token in Authorization: Bearer <token> header'
  });
});

module.exports = router;