
// ==========================================
// FILE: classwork12.js - Role Escalation
// ==========================================
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./config');

// Login endpoint - returns JWT with role
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'john' && password === 'user123') {
    const token = jwt.sign(
      { username: 'john', role: 'user', userId: 1001 },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // VULNERABILITY: Response contains role that client can manipulate
    res.json({
      success: true,
      token: token,
      user: {
        username: 'john',
        role: 'user', // Client can intercept and change to 'admin'
        userId: 1001
      },
      message: 'Intercept this response and change role to admin!'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected endpoint - VULNERABLE (trusts client-provided role)
router.get('/admin-panel', (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    // VULNERABILITY: Gets role from query parameter (client-controlled!)
    const clientRole = req.query.role;

    if (clientRole === 'admin') {
      return res.json({
        flag: 'FLAG{role_escalation_response_manipulation_success}',
        message: 'You escalated privileges by manipulating the response!',
        adminSecret: 'ADMIN_SECRET_KEY_12345',
        warning: 'Always verify roles SERVER-SIDE, never trust client data!'
      });
    }

    res.json({
      message: 'Access denied. User role detected.',
      hint: 'Intercept the /login response and change role from "user" to "admin", then add ?role=admin to this request'
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;