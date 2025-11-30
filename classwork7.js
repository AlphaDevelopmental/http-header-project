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
    return res.status(403).json({ 
      error: 'Browser access blocked',
      hint: 'Use API client'
    });
  }

  if (req.method !== 'OPTIONS') {
    return res.status(405).json({ 
      error: `Method ${req.method} not allowed`,
      hint: 'Try the method used for CORS preflight requests'
    });
  }

  if (contentType?.toLowerCase() !== 'application/json') {
    return res.status(415).json({ 
      error: 'Invalid Content-Type',
      hint: 'Set Content-Type: application/json'
    });
  }

  if (customHeader !== 'QPD3f%opvalue') {
    return res.status(400).json({ 
      error: 'Invalid custom header',
      hint: 'X-Custom-Header must be exactly: QPD3f%opvalue'
    });
  }

  if (accessQuery !== 'granted') {
    return res.status(401).json({ 
      error: 'Missing access query parameter',
      hint: 'Add query parameter: ?access=granted'
    });
  }

  if (!referer?.includes('trusted-client.local')) {
    return res.status(403).json({ 
      error: 'Invalid Referer',
      hint: 'Referer must include "trusted-client.local"'
    });
  }

  const regex = /^agent-\d{3}$/;
  if (!codeNameHeader || !regex.test(codeNameHeader)) {
    return res.status(400).json({ 
      error: 'Invalid code name',
      hint: 'X-Code-Name must match pattern: agent-### (e.g., agent-007)'
    });
  }

  if (cookie !== SESSION_ID) {
    return res.status(401).json({ 
      error: 'Invalid session cookie',
      hint: 'Login first to get session cookie'
    });
  }

  next();
};

router.options('/', validateHeaders, (req, res) => {
  const { name, level } = req.body;

  if (name !== 'cyber' || level !== 5) {
    return res.status(400).json({ 
      error: 'Invalid request body',
      hint: 'Body must be: {"name": "cyber", "level": 5}'
    });
  }

  res.json({
    flag: 'FLAG_CLASSWORK7=FLAG{regex_referer_options_god_mode}',
    message: '✅ Challenge 7 completed! Pattern matching mastered!',
    nextChallenge: '/classwork8',
    warning: 'Final challenge requires cryptography skills'
  });
});

module.exports = router;
// This code defines an Express.js route that handles PUT, PATCH, and DELETE requests.
// It uses a middleware function `validateRequest` to check for the presence of specific headers,
// a valid JWT token in the Authorization header, and a valid session cookie.
// If any of these checks fail, it responds with an appropriate error message and hint.
// If all checks pass, it allows the request to proceed to the respective route handler,
// which responds with a flag and success message.
// The route is exported as a module for use in an Express application.
// To test these routes, you need to login first of get you jwt token and cookies.
// This middleware checks for multiple headers, a query parameter, and a request body.
// If any of these checks fail, it returns an appropriate error response with hints.
// If all checks pass, it calls `next()` to proceed to the route handler.
// The session cookie value should match the expected SESSION_ID from the config.
// This middleware is designed to be used in protected routes to ensure that only requests
// meeting all criteria can access them.
/*
curl -X OPTIONS "http://localhost:3000/classwork7?access=granted" \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: QPD3f%opvalue" \
  -H "X-Code-Name: agent-007" \
  -H "Referer: https://trusted-client.local/page" \
  --cookie "sessionid=<your_session_id>" \
  -d '{"name": "cyber", "level": 5}'
*/