
// ==========================================
// DEFENSE TUTORIAL CODE
// FILE: classwork12-secure.js
// ==========================================

// SECURE VERSION - Role Escalation Defense

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'john' && password === 'user123') {
    // SECURE: Role is in JWT (server-side, signed)
    const token = jwt.sign(
      { username: 'john', role: 'user' },
      SECRET_KEY
    );

    // SECURE: Don't expose role in response body
    res.json({
      success: true,
      token: token
      // No role in response - client can't manipulate it
    });
  }
});

router.get('/admin-panel', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  try {
    // SECURE: Get role from SERVER-VERIFIED JWT, not client input
    const decoded = jwt.verify(token, SECRET_KEY);
    
    if (decoded.role === 'admin') {
      res.json({ adminData: 'SECRET' });
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;