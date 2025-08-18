const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { SECRET_KEY, SESSION_ID } = require('./config');

router.all('/', (req, res, next) => {
  const expectedMethod = 'DELETE';
  const actualMethod = req.method;
  const contentType = req.headers['content-type'];
  const userAgent = req.headers['user-agent'];
  const customHeader = req.headers['x-custom-header'];
  const cookie = req.cookies.sessionid;
  const authHeader = req.headers['authorization'];

  // Block browser clients
  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({
      error: 'Browser access blocked. Use curl, Postman, or Thunder Client.'
    });
  }

  // Enforce DELETE method
  if (actualMethod !== expectedMethod) {
    return res.status(405).json({
      error: `Method Not Allowed. Use DELETE instead of ${actualMethod}.`
    });
  }

  // Optional: Enforce Content-Type
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({
      error: 'Missing or incorrect Content-Type. Set it to application/json.'
    });
  }

  // Check custom header
  if (!customHeader || customHeader.toLowerCase() !== 'secretvalue') {
    return res.status(400).json({
      error: 'Missing or incorrect X-Custom-Header. Set it to "secretvalue".'
    });
  }

  // Check cookie
  if (!cookie || cookie !== SESSION_ID) {
    return res.status(401).json({
      error: `Missing or incorrect sessionid cookie. Expected sessionid=${SESSION_ID}`
    });
  }

  // Check JWT token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Missing Authorization header with Bearer token.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next(); // All checks passed
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired JWT token.'
    });
  }
});

router.delete('/', (req, res) => {
  res.json({
    flag: 'FLAG{delete_protectedroute_verified_passed}',
    message: '✅ DELETE method + headers + token + cookie challenge passed!'
  });
});

module.exports = router;
// This code defines an Express.js route that checks the User-Agent, HTTP method, Content-Type, custom header, session cookie, and JWT token for DELETE requests.
// If any of these checks fail, it returns an appropriate error response. 
/*
// first of get you jwt token and cookies 

/*
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "pass123"}'
// This will return a JWT token and set a session cookie.
// Use the token and cookie in subsequent requests to protected routes.
// Make sure to replace the SECRET_KEY and SESSION_ID in config.js with your actual values.

curl -X DELETE http://localhost:3000/classwork6 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <your_token>" \
  --cookie "sessionid=5u48p43c2piajum0e2ruu71vs1" \
  -d '{"key": "value"}'

*/