const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // For token verification

// Secret key for JWT (should be stored securely in a real application)
const SECRET_KEY = 'your_secret_key';

router.all('/', (req, res, next) => {
  const expectedMethod = 'DELETE';
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

router.delete('/', (req, res) => {
  res.json({
    flag: 'FLAG{delete_method_passed}',
    message: 'Congratulations! You passed the DELETE method challenge.'
  });
});

module.exports = router;

// This code defines an Express.js route that checks various conditions for incoming DELETE requests.
// It verifies the HTTP method, Content-Type header, custom header, cookie, and JWT token.
// If all checks pass, it allows the request to proceed to the next handler.
// If any check fails, it responds with an appropriate error message and status code.
// The route is exported as a module for use in an Express application.
// The JWT token verification uses a secret key, which should be securely stored in a real application.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
// The flag is a placeholder and should be replaced with an actual flag value in a real application.
// The code is designed to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
// The code is designed to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.

// curl -X DELETE http://localhost:3000 \
// -H "Content-Type: application/json" \
// -H "X-Custom-Header: secretvalue" \
// -H "Cookie: sessionid=valid_session" \
// -H "Authorization: Bearer your_token"\ 
// -d '{"key":"value"}'
// This curl command sends a DELETE request to the server with the required headers and body.
// The command includes the necessary headers and a JSON body, which is required for the DELETE method challenge.
// The command is designed to pass all the checks defined in the Express.js route, allowing the request to succeed and receive the flag.
// The command is structured to be used with tools like curl, Postman, or Thunder Client, as browsers are blocked by the User-Agent check.
// The command is designed to be used in a testing or educational environment, where users can learn about HTTP methods and headers.