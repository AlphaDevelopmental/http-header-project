const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // For token verification

// Secret key for JWT (should be stored securely in a real application)
const SECRET_KEY = 'your_secret_key';

router.all('/', (req, res, next) => {
  const expectedMethod = 'OPTIONS';
  const actualMethod = req.method;
  const contentType = req.headers['content-type'];
  const userAgent = req.headers['user-agent'];
  const customHeader = req.headers['x-custom-header'];
  const codeNameHeader = req.headers['x-code-name'];
  const referrer = req.headers['referer'] || req.headers['referrer'];
  const cookie = req.headers['cookie'];
  const queryParam = req.query.access;
  // Check User-Agent
  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({
      error: 'Use curl, Postman, or Thunder Client — Browser Not Allowed.'
    });
  }
  // Check HTTP Method
  if (actualMethod !== expectedMethod) {
    return res.status(405).json({
      error: `Hint: Use a different method instead of ${actualMethod}`
    });
  }

  // Check Content-Type
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({
      error: 'Set header Content-Type: application/json'
    });
  }

  // Check Custom Header
  if (!customHeader || customHeader.toLowerCase() !== 'QPD3f%opvalue') {
    return res.status(400).json({
      error: 'Set header X-Custom-Header: QPD3f%0pvalue'
    });
  }
  // Check access query parameter 
  if (accessQuery !== 'granted') {
    return res.status(401).json({
      error: 'Missing or incorrect query parameter. Use ?access=granted'
    });
  }
  // Referrer check
  if (!referrer || !referrer.includes('trusted-client.local')) {
    return res.status(403).json({
      error: 'Missing or incorrect Referer header (must include trusted-client.local)'
    });
  }

  // Regex match for header
  const regex = /^agent-\d{3}$/;
  if (!codeNameHeader || !regex.test(codeNameHeader)) {
    return res.status(400).json({
      error: 'Header X-Code-Name must match pattern agent-### (e.g., agent-007)'
    });
  }
  // If all checks pass, proceed to the next middleware or route handler
  next();
});

// Final GET response
router.get('/', (req, res) => {
  // Validate body content
  const { name, level } = req.body;

if (typeof name !== 'cyber' || typeof level !== '5') {
  return res.status(400).json({
    error: 'Request body must be JSON with { "name": cyber , "level": 5 }'
  });
}

  res.json({
    flag: 'FLAG{multi-layered_http_master}',
    message: 'Awesome! You passed all security and header validation tasks.'
  });
});
module.exports = router;
// This code defines an Express.js route that checks various headers, query parameters, and request methods.
// It validates the User-Agent, HTTP method, Content-Type, custom headers, query parameters, and referrer.
// If all checks pass, it responds with a success message and a flag.
// If any check fails, it responds with an appropriate error message and status code.
// The code is designed to be modular and can be integrated into a larger Express application.
// The route is exported as a module for use in an Express application.
// The code includes checks for specific header values, query parameters, and request methods,
// making it suitable for educational or challenge purposes.
// The code is structured to provide feedback to the user about the checks they need to pass,
// making it suitable for educational or challenge purposes.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
// The code is designed to provide a simple challenge for users to pass by using the correct method and headers. 
/*
curl -X OPTIONS "http://localhost:3000/classwork7?access=granted" \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "X-Code-Name: agent-007" \
  -H "Referer: https://trusted-client.local/dashboard" \
  -H "User-Agent: curl/7.85.0" \
  -d '{"name": "Ezekiel", "level": 7}'
// This curl command sends an OPTIONS request to the server with the required headers and query parameter.
// The request body must be in JSON format with the specified fields.
*/