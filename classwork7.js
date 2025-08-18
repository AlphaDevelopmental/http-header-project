const express = require('express');
const router = express.Router();
const { SESSION_ID } = require('./config');

const validateHeaders = (req, res, next) => {
  const {
    'user-agent': userAgent,
    'content-type': contentType,
    'x-custom-header': customHeader,
    'x-code-name': codeNameHeader,
    referer
  } = req.headers;

  const cookie = req.cookies.sessionid;
  const accessQuery = req.query.access;

  if (userAgent?.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ error: 'Browser access blocked. Use curl, Postman, or Thunder Client.' });
  }

  if (req.method !== 'OPTIONS') {
    return res.status(405).json({ error: `Method Not Allowed. Use OPTIONS.` });
  }

  if (contentType?.toLowerCase() !== 'application/json') {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }

  if (customHeader !== 'QPD3f%opvalue') {
    return res.status(400).json({ error: 'X-Custom-Header must be "QPD3f%opvalue"' });
  }

  if (accessQuery !== 'granted') {
    return res.status(401).json({ error: 'Query parameter "access=granted" required' });
  }

  if (!referer?.includes('trusted-client.local')) {
    return res.status(403).json({ error: 'Referer must include "trusted-client.local"' });
  }

  const regex = /^agent-\d{3}$/;
  if (!regex.test(codeNameHeader)) {
    return res.status(400).json({ error: 'X-Code-Name must match pattern agent-###' });
  }

  if (cookie !== SESSION_ID) {
    return res.status(401).json({ error: `Invalid session cookie. Expected sessionid=${SESSION_ID}` });
  }

  next();
};

router.options('/', validateHeaders, (req, res) => {
  const { name, level } = req.body;

  if (name !== 'cyber' || level !== 5) {
    return res.status(400).json({ error: 'Body must be { "name": "cyber", "level": 5 }' });
  }

  res.json({
    flag: 'FLAG{multi-layered_http_master}',
    message: '✅ OPTIONS challenge passed!'
  });
});

module.exports = router;
// This code defines an Express.js router that handles OPTIONS requests with multiple header validations.
/*
// first of get you jwt token and cookies 

/*
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "pass123"}'
// This will return a JWT token and set a session cookie.
// Use the token and cookie in subsequent requests to protected routes.
// Make sure to replace the SECRET_KEY and SESSION_ID in config.js with your actual values.


curl -X OPTIONS "http://localhost:3000/classwork7?access=granted" \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: QPD3f%opvalue" \
  -H "X-Code-Name: agent-007" \
  -H "Referer: https://trusted-client.local/dashboard" \
  -H "Authorization: Bearer <your_token>" \
  --cookie "sessionid=5u48p43c2piajum0e2ruu71vs1" \
  -d '{"name": "cyber", "level": 5}'
// This will test the OPTIONS route with the required headers, query parameter, and body.
// Make sure to replace the SESSION_ID in config.js with your actual session ID.
// This code is designed to validate multiple headers, a query parameter, and a JSON body in an OPTIONS request.
// It checks for browser access, method, content type, custom headers, query parameters, referer, and session cookies.
// If all validations pass, it responds with a success message and a flag.
// If any validation fails, it responds with an appropriate error message and status code.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express
*/