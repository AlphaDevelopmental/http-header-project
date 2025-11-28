const express = require('express');
const router = express.Router();

let requestCount = {};

// Clean up old entries every minute
setInterval(() => {
  const now = Date.now();
  Object.keys(requestCount).forEach(ip => {
    if (now - requestCount[ip].timestamp > 60000) {
      delete requestCount[ip];
    }
  });
}, 60000);

router.all('/', (req, res) => {
  const ip = req.ip;
  const bypassToken = req.headers['x-bypass-token'];
  const userAgent = req.headers['user-agent'];

  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ 
      error: 'Browser access blocked',
      hint: 'Use API client'
    });
  }

  // Initialize rate tracking
  if (!requestCount[ip]) {
    requestCount[ip] = { count: 0, timestamp: Date.now() };
  }

  const now = Date.now();
  
  // Reset counter if window expired
  if (now - requestCount[ip].timestamp > 60000) {
    requestCount[ip] = { count: 0, timestamp: now };
  }

  requestCount[ip].count++;

  // Rate limit: 3 requests per minute
  if (requestCount[ip].count > 3) {
    if (bypassToken !== 'bypass-rate-limit-2025') {
      return res.status(429).json({ 
        error: 'Rate limit exceeded (3 requests per minute)',
        hint: 'Look for a special header to bypass rate limiting',
        attempts: requestCount[ip].count,
        windowReset: '60 seconds from first request'
      });
    }
  }

  res.json({
    flag: 'FLAG{rate_limit_bypass_discovered}',
    message: '✅ Challenge 9 completed! Rate limit bypass found!',
    bypassUsed: bypassToken === 'bypass-rate-limit-2025',
    requestCount: requestCount[ip].count,
    nextChallenge: '/classwork10'
  });
});

module.exports = router;
