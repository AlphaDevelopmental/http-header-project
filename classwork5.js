const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { SECRET_KEY, SESSION_ID } = require('./config');

const validateRequest = (req, res, next) => {
  const { 'content-type': contentType, 'user-agent': userAgent, 'x-custom-header': customHeader, authorization } = req.headers;
  const cookie = req.cookies.sessionid;

  if (userAgent?.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ error: 'Browser access blocked. Use curl, Postman, or Thunder Client.' });
  }

  if (contentType?.toLowerCase() !== 'application/json') {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }

  if (customHeader !== 'secretvalue') {
    return res.status(400).json({ error: 'X-Custom-Header must be "secretvalue"' });
  }

  if (cookie !== SESSION_ID) {
    return res.status(401).json({ error: `Invalid session cookie. Expected sessionid=${SESSION_ID}` });
  }

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  try {
    const token = authorization.split(' ')[1];
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired JWT token' });
  }
};

router.put('/', validateRequest, (req, res) => {
  res.json({ flag: 'FLAG{Put_with_headers_token_cookie_passed}', message: '🎉 PUT challenge passed!' });
});

router.patch('/', validateRequest, (req, res) => {
  res.json({ flag: 'FLAG{patch_authorized_header_cookie_check_success}', message: '🎉 PATCH challenge passed!' });
});

router.delete('/', validateRequest, (req, res) => {
  res.json({ flag: 'FLAG{delete_header_cookie_jwt_validation_complete}', message: '🎉 DELETE challenge passed!' });
});

module.exports = router;


// first of get you jwt token and cookies 

/*
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "pass123"}'
// This will return a JWT token and set a session cookie.
// Use the token and cookie in subsequent requests to protected routes.
// Make sure to replace the SECRET_KEY and SESSION_ID in config.js with your actual values.

curl -X PUT http://localhost:3000/classwork5 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <your_token>" \
  --cookie "sessionid=5u48p43c2piajum0e2ruu71vs1" \
  -d '{}'
// This will test the PUT route with the required headers and cookie.
curl -X PATCH http://localhost:3000/classwork5 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <your_token>" \
  --cookie "sessionid=5u48p43c2piajum0e2ruu71vs1" \
  -d '{}'

  curl -X DELETE http://localhost:3000/classwork5 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <your_token>" \
  --cookie "sessionid=5u48p43c2piajum0e2ruu71vs1"
*/