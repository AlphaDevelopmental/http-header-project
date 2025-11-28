const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const userAgent = req.headers['user-agent'];

  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ 
      error: 'Browser access blocked',
      hint: 'Use API client'
    });
  }

  // Get all header keys in order they were received
  const headerKeys = Object.keys(req.headers);
  
  // Required headers in specific order
  const requiredHeaders = ['content-type', 'x-first', 'x-second', 'x-third'];
  
  // Filter to only headers we care about, preserving order
  const relevantHeaders = headerKeys.filter(h => requiredHeaders.includes(h));
  
  // Check if we have all required headers
  const missingHeaders = requiredHeaders.filter(h => !relevantHeaders.includes(h));
  
  if (missingHeaders.length > 0) {
    return res.status(400).json({
      error: 'Missing required headers',
      missing: missingHeaders,
      hint: 'You need all four headers: content-type, x-first, x-second, x-third'
    });
  }

  // Check order
  const isCorrectOrder = JSON.stringify(relevantHeaders) === JSON.stringify(requiredHeaders);
  
  if (!isCorrectOrder) {
    return res.status(400).json({
      error: 'Headers in wrong order',
      yourOrder: relevantHeaders,
      correctOrder: requiredHeaders,
      hint: 'Headers must be sent in the exact order specified'
    });
  }

  // Check header values
  const { 'x-first': first, 'x-second': second, 'x-third': third } = req.headers;
  
  if (first !== 'alpha' || second !== 'beta' || third !== 'gamma') {
    return res.status(400).json({
      error: 'Invalid header values',
      hint: 'X-First: alpha, X-Second: beta, X-Third: gamma'
    });
  }

  res.json({
    flag: 'FLAG{header_order_matters_expert}',
    message: '✅ Challenge 10 completed! You mastered header ordering!',
    congratulations: '🎉 You completed ALL challenges! You are an HTTP master!',
    achievement: 'HTTP Header CTF Champion',
    totalFlags: 14
  });
});

module.exports = router;
// This code defines an Express.js route that checks for the presence and order of specific HTTP headers in incoming POST requests.
// It verifies that the headers 'Content-Type', 'X-First', 'X-Second', and 'X-Third' are present in the correct order
// and that they have the expected values ('alpha', 'beta', 'gamma').
// If any checks fail, it responds with a 400 status code and an error message indicating the issue.
// If all checks pass, it responds with a JSON object containing a flag and a success message.
// The route is exported as a module for use in an Express application.
// To test this route, send a POST request with the required headers in the correct order and values.
// Example using curl:
// curl -X POST http://localhost:3000/classwork10 \
//   -H "Content-Type: application/json" \
//   -H "X-First: alpha" \
//   -H "X-Second: beta" \
//   -H "X-Third: gamma"
//    The code is designed to provide a challenging exercise in HTTP header management and ordering.