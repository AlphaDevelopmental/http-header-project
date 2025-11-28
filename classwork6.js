const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { SECRET_KEY, SESSION_ID } = require('./config');

router.all('/', (req, res) => {
  const expectedMethod = 'DELETE';
  const actualMethod = req.method;
  const contentType = req.headers['content-type'];
  const userAgent = req.headers['user-agent'];
  const customHeader = req.headers['x-custom-header'];
  const cookie = req.cookies.sessionid;
  const authHeader = req.headers['authorization'];

  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({
      error: 'Browser access blocked',
      hint: 'Use API client'
    });
  }

  if (actualMethod !== expectedMethod) {
    return res.status(405).json({
      error: `Method ${actualMethod} not allowed`,
      hint: 'This challenge requires DELETE method'
    });
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
      hint: 'Add header: X-Custom-Header: secretvalue'
    });
  }

  if (!cookie || cookie !== SESSION_ID) {
    return res.status(401).json({
      error: 'Invalid session cookie',
      hint: `Expected sessionid=${SESSION_ID}`
    });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Missing Authorization header',
      hint: 'Add header: Authorization: Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired JWT token',
      hint: 'Login again for fresh token'
    });
  }

  res.json({
    flag: 'FLAG{delete_protectedroute_verified_passed}',
    message: '✅ Challenge 6 completed!',
    nextChallenge: '/classwork7',
    difficulty: 'Increasing...'
  });
});

module.exports = router;
// This code defines an Express.js route that handles DELETE requests.
// It checks for the presence of specific headers, a valid JWT token in the Authorization header,
// and a valid session cookie. If any of these checks fail, it responds with an appropriate error message and hint.
// If all checks pass, it responds with a JSON object containing a flag and a success message.
// The route is exported as a module for use in an Express application.