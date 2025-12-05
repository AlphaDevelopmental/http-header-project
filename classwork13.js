
// ==========================================
// FILE: classwork13.js - Cookie Tampering
// ==========================================
const express = require('express');
const router = express.Router();

// Login endpoint - sets insecure cookie
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'alice' && password === 'pass123') {
    // VULNERABILITY: Setting sensitive data in cookies without encryption/signing
    res.cookie('user_data', JSON.stringify({
      username: 'alice',
      role: 'user',
      credits: 100
    }), {
      httpOnly: false, // VULNERABILITY: Accessible to JavaScript
      secure: false,
      sameSite: 'Lax'
    });

    res.json({
      success: true,
      message: 'Login successful. Check your cookies!',
      hint: 'Cookie contains user_data. Try modifying the role or credits!'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected endpoint - VULNERABLE (trusts cookie data)
router.get('/premium-content', (req, res) => {
  const userDataCookie = req.cookies.user_data;

  if (!userDataCookie) {
    return res.status(401).json({ 
      error: 'No user cookie found',
      hint: 'Login first at /classwork13/login'
    });
  }

  try {
    const userData = JSON.parse(userDataCookie);

    // VULNERABILITY: Trusts client-side cookie without validation
    if (userData.role === 'premium' && userData.credits >= 1000) {
      return res.json({
        flag: 'FLAG{cookie_tampering_client_side_validation_bypassed}',
        message: 'You manipulated cookies successfully!',
        premiumContent: 'SECRET_PREMIUM_DATA',
        warning: 'Always validate and sign cookies server-side!'
      });
    }

    res.json({
      message: 'Access denied. Premium membership required.',
      yourData: userData,
      hint: 'Modify the cookie to have role: "premium" and credits: 1000'
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid cookie format' });
  }
});

module.exports = router;