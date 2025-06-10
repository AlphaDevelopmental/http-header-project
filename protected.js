const jwt = require('jsonwebtoken');
const SECRET = 'supersecretkey'; // Use same secret as in login.js

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const cookie = req.cookies.sessionid;
  const customHeader = req.headers['x-custom-header'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (cookie !== '5u48p43c2piajum0e2ruu71vs1') {
    return res.status(401).json({ error: 'Invalid session cookie' });
  }

  if (customHeader !== 'secretvalue') {
    return res.status(403).json({ error: 'Missing or invalid custom header' });
  }

  try {
    jwt.verify(token, SECRET);
    next(); // All good
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
// This middleware checks for the presence of a valid JWT token in the Authorization header,
// a valid session cookie, and a custom header. If any of these checks fail, it returns an appropriate error response.
// If all checks pass, it calls `next()` to proceed to the next middleware or route handler.
// The secret key used for JWT verification should match the one used in the login route.
// Make sure to use the same secret key as in your login route for consistency.
// The session cookie and custom header values should also match those expected by your application.
// This middleware is designed to be used in protected routes to ensure that only authenticated requests can access them.