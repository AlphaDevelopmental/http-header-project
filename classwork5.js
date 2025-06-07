const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // For token verification

// Secret key for JWT (should be stored securely in a real application)
const SECRET_KEY = 'your_secret_key';

const checkHeadersAndToken = (req, res, next) => {
  const contentType = req.headers['content-type'];
  const userAgent = req.headers['user-agent'];
  const customHeader = req.headers['x-custom-header'];
  const cookie = req.headers['cookie'];
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  // Check User-Agent
  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({
      error: 'Use curl, Postman, or Thunder Client — browser not allowed.'
    });
  }

  // Check Content-Type
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({
      error: 'Set header Content-Type: application/json'
    });
  }

  // Check Custom Header
  if (!customHeader || customHeader.toLowerCase() !== 'secretvalue') {
    return res.status(400).json({
      error: 'Set header X-Custom-Header: secretvalue'
    });
  }

  // Check Cookie
  if (!cookie || !cookie.includes('sessionid=valid_session')) {
    return res.status(401).json({
      error: 'Set cookie with sessionid=valid_session'
    });
  }

  // Verify JWT Token
  if (!token) {
    return res.status(401).json({
      error: 'Authorization token is missing'
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }

  // If all checks pass, proceed to the next middleware or route handler
  next();
};

// PUT method handler
router.put('/', checkHeadersAndToken, (req, res) => {
  res.json({
    flag: 'FLAG{put_method_passed}',
    message: 'Congratulations! You passed the PUT method challenge.'
  });
});

// PATCH method handler
router.patch('/', checkHeadersAndToken, (req, res) => {
  res.json({
    flag: 'FLAG{patch_method_passed}',
    message: 'Congratulations! You passed the PATCH method challenge.'
  });
});

// DELETE method handler
router.delete('/', checkHeadersAndToken, (req, res) => {
  res.json({
    flag: 'FLAG{delete_method_passed}',
    message: 'Congratulations! You passed the DELETE method challenge.'
  });
});

module.exports = router;
// This code defines an Express.js router that handles PUT, PATCH, and DELETE requests.
// It checks various headers and a JWT token for validation.
// If all checks pass, it responds with a success message and a flag.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
// The JWT token verification uses a secret key, which should be securely stored in a real application.
// The router is exported as a module for use in an Express application.
// The checks include User-Agent, Content-Type, custom headers, cookies, and JWT tokens.
// The code is designed to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.

// curl -X PUT http://localhost:3000 \
// -H "Content-Type: application/json" \
// -H "X-Custom-Header: secretvalue" \
// -H "Cookie: sessionid=valid_session" \
// -H "Authorization: Bearer your_token" \
// -d '{"key":"value"}'\ 

// curl -X PATCH http://localhost:3000 \
// -H "Content-Type: application/json" \
// -H "X-Custom-Header: secretvalue" \
// -H "Cookie: sessionid=valid_session" \
// -H "Authorization: Bearer your_token" \
// -d '{"key":"value"}'\ 

// curl -X DELETE http://localhost:3000 \
// -H "Content-Type: application/json" \
// -H "X-Custom-Header: secretvalue" \
// -H "Cookie: sessionid=valid_session" \
// -H "Authorization: Bearer your_token"

