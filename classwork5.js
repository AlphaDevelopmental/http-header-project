const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Constants for validation 
const SECRET_KEY = 'my-very-secret-key';
const SESSION_ID = '5u48p43c2piajum0e2ruu71vs1';

// Middleware: Validate headers, cookies, and token
const checkHeadersAndToken = (req, res, next) => {
  const contentType = req.headers['content-type'];
  const userAgent = req.headers['user-agent'];
  const customHeader = req.headers['x-custom-header'];
  const cookie = req.cookies['sessionid']; // parsed by cookie-parser
  const authHeader = req.headers['authorization'];

  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ error: 'Access blocked: Use curl, Postman, or Thunder Client — Browser Not Allowed.' });
  }

  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({ error: 'Missing or incorrect header: Content-Type must be application/json' });
  }

  if (!customHeader || customHeader.toLowerCase() !== 'secretvalue') {
    return res.status(400).json({ error: 'Missing or incorrect header: X-Custom-Header must be "secretvalue"' });
  }

  if (!cookie || cookie !== SESSION_ID) {
    return res.status(401).json({ error:  `Unauthorized: Set cookie "sessionid=${SESSION_ID}"`  });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header. Use Bearer token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error:'Invalid or expired JWT token.' });
  }

  next();
};

// Routes
router.put('/', checkHeadersAndToken, (req, res) => {
  res.json({ 
    flag: 'FLAG{Put_with_headers_token_cookie_passed}', 
    message:  '🎉 PUT challenge passed! All headers and token were valid.' });
});

router.patch('/', checkHeadersAndToken, (req, res) => {
  res.json({ 
    flag: 'FLAG{patch_authorized_header_cookie_check_success}', 
    message: '🎉 PATCH challenge passed! Great job!' });
});

router.delete('/', checkHeadersAndToken, (req, res) => {
  res.json({ 
    flag: 'FLAG{delete_header_cookie_jwt_validation_complete}', 
    message: '🎉 DELETE challenge passed! Well done!' });
});

module.exports = router;
// This code defines an Express.js router that handles PUT, PATCH, and DELETE requests.
// It includes middleware to validate headers, cookies, and JWT tokens.
// If the request passes all checks, it responds with a success message and a flag.
// The code is designed to be modular and can be integrated into a larger Express application.
// The middleware checks for the User-Agent, Content-Type, custom headers, cookies, and JWT tokens.
// If any check fails, it responds with an appropriate error message and status code.
// The flags are placeholders and should be replaced with actual flag values in a real application.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
// The JWT token verification uses a secret key, which should be securely stored in a real application.
// The code is designed to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
// The code is structured to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
// The code is designed to provide a simple challenge for users to pass by using the correct method and headers.
/*
✅ classwork5.js - Header & JWT Validation Challenge

🌐 Requirements for all PUT/PATCH/DELETE requests:
- User-Agent: Must NOT be a browser (Mozilla)
- Content-Type: application/json
- X-Custom-Header: secretvalue
- Cookie: sessionid=5u48p43c2piajum0e2ruu71vs1
- Authorization: Bearer <valid JWT signed with 'my-very-secret-key'>

🔐 Token can be generated in dev using:
const jwt = require('jsonwebtoken');
const token = jwt.sign({ user: 'test' }, 'my-very-secret-key');

🧪 Example curl test:
curl -X PUT http://localhost:3000/classwork5 \
-H "Content-Type: application/json" \
-H "X-Custom-Header: secretvalue" \
-H "Authorization: Bearer <your_token>" \
--cookie "sessionid=5u48p43c2piajum0e2ruu71vs1"

🚀 Flags are designed to reflect challenge components: method + validation passed
*/