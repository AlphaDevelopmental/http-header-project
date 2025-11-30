const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { SECRET_KEY, SESSION_ID } = require('./config');

const validateRequest = (req, res, next) => {
  const { 'content-type': contentType, 'user-agent': userAgent, 'x-custom-header': customHeader, authorization } = req.headers;
  const cookie = req.cookies.sessionid;

  if (userAgent?.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ 
      error: 'Browser access blocked',
      hint: 'Use API client'
    });
  }

  if (contentType?.toLowerCase() !== 'application/json') {
    return res.status(415).json({ 
      error: 'Invalid Content-Type',
      hint: 'Set Content-Type: application/json'
    });
  }

  if (customHeader !== 'secretvalue') {
    return res.status(400).json({ 
      error: 'Invalid custom header',
      hint: 'Add header: X-Custom-Header: secretvalue'
    });
  }

  if (cookie !== SESSION_ID) {
    return res.status(401).json({ 
      error: 'Invalid session cookie',
      hint: `Login first at /login to get cookie`
    });
  }

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Missing Authorization header',
      hint: 'Add header: Authorization: Bearer <token_from_login>'
    });
  }

  try {
    const token = authorization.split(' ')[1];
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    return res.status(401).json({ 
      error: 'Invalid or expired JWT token',
      hint: 'Login again to get fresh token'
    });
  }
};

router.put('/', validateRequest, (req, res) => {
  res.json({ 
    flag: 'FLAG_CLASSWORK5_PUT=FLAG{patch_with_jwt_cookie_authorized!}', 
    message: '✅ PUT challenge passed!',
    note: 'Try PATCH and DELETE methods too'
  });
});

router.patch('/', validateRequest, (req, res) => {
  res.json({ 
    flag: 'FLAG_CLASSWORK5_PATCH=FLAG{patch_with_jwt_cookie_success}', 
    message: '✅ PATCH challenge passed!',
    note: 'One more method to go!'
  });
});

router.delete('/', validateRequest, (req, res) => {
  res.json({ 
    flag: 'FLAG_CLASSWORK5_DELETE=FLAG{patch_with_jwt_cookie_Complete!}', 
    message: '✅ DELETE challenge passed!',
    nextChallenge: '/classwork6'
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
// To test these routes, you need to login 
// to obtain a valid JWT token and session cookie.
/*
curl -X PUT http://localhost:3000/classwork5 \
-H "Content-Type: application/json" \
-H "X-Custom-Header: secretvalue" \
-H "Authorization: Bearer <token_from_login>" \
--cookie "sessionid=<session_id_from_login>"
*/

/* 
curl -X PATCH http://localhost:3000/classwork5 \
-H "Content-Type: application/json" \
-H "X-Custom-Header: secretvalue" \
-H "Authorization: Bearer <token_from_login>" \
--cookie "sessionid=<session_id_from_login>"
*/

/* 
curl -X DELETE http://localhost:3000/classwork5 \
-H "Content-Type: application/json" \
-H "X-Custom-Header: secretvalue" \ 
-H "Authorization: Bearer <token_from_login>" \
--cookie "sessionid=<session_id_from_login>"
*/