const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { SECRET_KEY, SESSION_ID } = require('./config');

const users = {
  student: { password: 'pass123', role: 'student' },
  admin: { password: 'admin123', role: 'admin' }
};

// Login route for this challenge
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ 
      error: 'Invalid credentials',
      hint: 'Try username: student/admin, password: pass123/admin123'
    });
  }

  const challenge = crypto.randomBytes(8).toString('hex');
  const token = jwt.sign(
    { user: username, role: user.role, challenge, iat: Math.floor(Date.now() / 1000) },
    SECRET_KEY,
    { expiresIn: '5m' }
  );

  res.cookie('sessionid', SESSION_ID, { httpOnly: true });
  res.json({ 
    token, 
    challenge,
    message: 'Use this token and challenge for the DELETE endpoint',
    instructions: {
      step1: 'Compute MD5 hash of the challenge value',
      step2: 'Create JSON payload with challenge and response',
      step3: 'Generate HMAC-SHA256 signature of the payload',
      step4: 'Send DELETE request with all headers and signature'
    }
  });
});

// Protected DELETE route
router.delete('/', (req, res) => {
  const userAgent = req.headers['user-agent'];
  const contentType = req.headers['content-type'];
  const customHeader = req.headers['x-custom-header'];
  const cookie = req.cookies.sessionid;
  const authHeader = req.headers['authorization'];
  const signature = req.headers['x-payload-signature'];

  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ error: 'Browser access blocked' });
  }

  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({ 
      error: 'Invalid Content-Type',
      hint: 'Set Content-Type: application/json'
    });
  }

  if (!customHeader || customHeader.toLowerCase() !== 'secretvalue') {
    return res.status(400).json({ 
      error: 'Invalid custom header',
      hint: 'X-Custom-Header must be: secretvalue'
    });
  }

  if (!cookie || cookie !== SESSION_ID) {
    return res.status(401).json({ 
      error: 'Invalid session cookie',
      hint: 'Use cookie from login response'
    });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Missing Authorization header',
      hint: 'Use token from /classwork8/login'
    });
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      hint: 'Token expires in 5 minutes. Login again if expired'
    });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now - decoded.iat > 300) {
    return res.status(403).json({ 
      error: 'Token expired',
      hint: 'Login again within 5 minutes'
    });
  }

  const payload = JSON.stringify(req.body);
  const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  
  if (!signature) {
    return res.status(400).json({ 
      error: 'Missing payload signature',
      hint: 'Generate HMAC-SHA256 of request body and add as X-Payload-Signature header'
    });
  }
  
  if (signature !== expectedSig) {
    return res.status(400).json({ 
      error: 'Invalid payload signature',
      hint: 'Signature must be HMAC-SHA256 of the JSON body using SECRET_KEY'
    });
  }

  const { challenge, response } = req.body;
  
  if (!challenge || !response) {
    return res.status(400).json({ 
      error: 'Missing challenge or response in body',
      hint: 'Body needs: {"challenge": "...", "response": "..."}'
    });
  }
  
  const expectedResponse = crypto.createHash('md5').update(decoded.challenge).digest('hex');
  
  if (response !== expectedResponse) {
    return res.status(400).json({ 
      error: 'Incorrect challenge response',
      hint: 'Response must be MD5 hash of the challenge from login'
    });
  }

  const role = decoded.role;
  let flag;

  if (role === 'admin') {
    flag = 'FLAG{admin_mastermind_verified}';
  } else if (role === 'student') {
    flag = 'FLAG{student_solved_the_layers}';
  } else {
    return res.status(403).json({ error: 'Unknown role' });
  }

  res.json({
    flag,
    message: '✅ Challenge 8 completed! You mastered cryptographic challenges!',
    congratulations: 'Amazing work! You completed all advanced challenges!',
    nextLevel: 'Try expert challenges: /classwork9 and /classwork10'
  });
});

module.exports = router;
// This code defines an Express.js route that handles DELETE requests to a protected endpoint.
// It requires a valid JWT token, specific headers, a session cookie, and a correctly signed request body.
// The route verifies the user's role from the token and responds with different flags based on the role.
// If any validation fails, it responds with appropriate error messages and hints for correction.
// The route is exported as a module for use in an Express application.
// To test these routes, you need to login first of get you jwt token and cookies.
// The DELETE endpoint requires cryptographic operations including MD5 hashing and HMAC-SHA256 signing.
// The code is designed to provide a challenging exercise in HTTP headers, authentication, and cryptography.