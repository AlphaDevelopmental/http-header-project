const jwt = require('jsonwebtoken');
const { SECRET_KEY, SESSION_ID } = require('./config');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const cookie = req.cookies.sessionid;
  const customHeader = req.headers['x-custom-header'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Missing or invalid Authorization header',
      hint: 'Add header: Authorization: Bearer <your_token>'
    });
  }

  const token = authHeader.split(' ')[1];

  if (cookie !== SESSION_ID) {
    return res.status(401).json({ 
      error: 'Invalid session cookie',
      hint: `Expected sessionid=${SESSION_ID}`
    });
  }

  if (customHeader !== 'secretvalue') {
    return res.status(403).json({ 
      error: 'Missing or invalid custom header',
      hint: 'Add header: X-Custom-Header: secretvalue'
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      hint: 'Login again to get a fresh token'
    });
  }
};
// This middleware checks for the presence of a valid JWT token in the Authorization header,
// a valid session cookie, and a custom header. If any of these checks fail, it returns an appropriate error response.
// If all checks pass, it calls `next()` to proceed to the next middleware or route handler.
// The secret key used for JWT verification should match the one used in the login route.
// Make sure to use the same secret key as in your login route for consistency.
// The session cookie and custom header values should also match those expected by your application.
// This middleware is designed to be used in protected routes to ensure that only authenticated requests can access them.