const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // For token verification

// Secret key for JWT signing (use env variables in production)
const SECRET_KEY = 'your_secret_key';

router.all('/', (req, res, next) => {
   const expectedMethod = 'DELETE';
  const actualMethod = req.method;
  const contentType = req.headers['content-type'];
  const userAgent = req.headers['user-agent'];
  const customHeader = req.headers['x-custom-header'];
  const cookie = req.headers['cookie'];
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // Check User-Agent
  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({
      error: 'Browser access blocked. Use curl, Postman, or Thunder Client.'
    });
  }

  // Check HTTP Method
  if (actualMethod !== expectedMethod) {
    return res.status(405).json({
      error: `Method Not Allowed. Hint: Use DELETE instead of ${actualMethod}.`
    });
  }

  // Check Content-Type
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({
      error:'Missing or incorrect Content-Type. Set it to application/json.'
    });
  }

  // Check Custom Header
  if (!customHeader || customHeader.toLowerCase() !== 'secretvalue') {
    return res.status(400).json({
      error: 'Missing or incorrect X-Custom-Header. Set it to "secretvalue".'
    });
  }

  // Check Cookie
  if (!cookie || !cookie.includes('sessionid=valid_session')) {
    return res.status(401).json({
      error: 'Missing or incorrect sessionid cookie. Set sessionid=valid_session.'
    });
  }

  // Verify JWT Token
  if (!token) {
    return res.status(401).json({
      error: 'Missing Authorization header with Bearer token.'
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired JWT token.'
    });
  }

  // If all checks pass, proceed to the next middleware or route handler
  next();
});

router.delete('/', (req, res) => {
  res.json({
    flag: 'FLAG{delete_protectedroute_verified_passed}',
    message:'✅ DELETE method + headers + token + cookie challenge passed!'
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
/*
✅ classwork6.js - Protected Route Challenge

🔒 Requirements:
- Method: DELETE only
- User-Agent: Must not be a browser
- Content-Type: application/json
- X-Custom-Header: secretvalue
- Cookie: sessionid=valid_session
- Authorization: Bearer <valid JWT signed with "your_secret_key">

🔐 Generate a token:
const jwt = require('jsonwebtoken');
const token = jwt.sign({ user: 'student' }, 'your_secret_key');

🧪 Example curl:
curl -X DELETE http://localhost:3000/classwork6 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Cookie: sessionid=valid_session" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"key": "value"}'

🧠 Teaching Points:
- Demonstrates advanced validation using headers, cookies, method, and JWT.
- Excellent for teaching layered HTTP protection logic.
- Encourages CLI-based exploration over browser testing.
*/
