const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // For token verification

// Secret key for JWT (should be stored securely in a real application)
const SECRET_KEY = 'your_secret_key';

router.all('/', (req, res, next) => {
  const expectedMethod = 'GET';
  const actualMethod = req.method;
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
});

router.get('/', (req, res) => {
  res.json({
    flag: 'FLAG{all_checks_passed}',
    message: 'Congratulations! You passed all the challenges.'
  });
});

module.exports = router;
// This code defines an Express.js route that performs multiple checks on incoming requests.
// It checks the HTTP method, Content-Type header, User-Agent, custom headers, cookies, and JWT tokens.
// If all checks pass, it responds with a success message and a flag.
// If any check fails, it responds with an appropriate error message and status code.
// The route is exported as a module for use in an Express application.
// The code is designed to be modular and can be integrated into a larger Express application.
// The JWT verification uses a secret key, which should be stored securely in a real application.
// The code is structured to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
// The flag is a placeholder and should be replaced with an actual flag value in a real application.
// The code is designed to be educational, guiding users through the process of passing various checks in an HTTP request.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.

// curl -X PATCH http://localhost:3000 \

// -H "Content-Type: application/json" \

// -H "X-Custom-Header: secretvalue" \

// -H "Cookie: sessionid=valid_session" \

// -H "Authorization: Bearer your_token" \

// -d '{"key":"value"}'
// This curl command sends a PATCH request to the server with the required headers and body.