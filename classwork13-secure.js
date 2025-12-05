
// ==========================================
// DEFENSE TUTORIAL CODE
// FILE: classwork13-secure.js
// ==========================================

// SECURE VERSION - Cookie Tampering Defense

const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

// Use signed cookies with a secret
const COOKIE_SECRET = 'your-secure-secret-key';
const app = express();
app.use(cookieParser(COOKIE_SECRET));

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'alice' && password === 'pass123') {
    // SECURE: Use signed cookies
    res.cookie('user_data', JSON.stringify({
      username: 'alice',
      role: 'user'
    }), {
      httpOnly: true,    // SECURE: Not accessible to JavaScript
      secure: true,      // SECURE: Only over HTTPS
      signed: true,      // SECURE: Cryptographically signed
      sameSite: 'Strict' // SECURE: CSRF protection
    });

    res.json({ success: true });
  }
});

router.get('/premium-content', (req, res) => {
  // SECURE: Use signed cookies and verify on server
  const userDataCookie = req.signedCookies.user_data;

  if (!userDataCookie) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userData = JSON.parse(userDataCookie);

  // SECURE: Verify role against database, not cookie
  const dbUser = database.getUserByUsername(userData.username);
  
  if (dbUser.role === 'premium') {
    res.json({ premiumContent: 'SECRET' });
  } else {
    res.status(403).json({ error: 'Premium required' });
  }
});

module.exports = router;