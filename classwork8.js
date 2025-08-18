const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { SECRET_KEY, SESSION_ID } = require('./config');

// Dummy user store
const users = {
  student: { password: 'pass123', role: 'student' },
  admin: { password: 'admin123', role: 'admin' }
};

// 🔐 Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const challenge = crypto.randomBytes(8).toString('hex');
  const token = jwt.sign(
    { user: username, role: user.role, challenge },
    SECRET_KEY,
    { expiresIn: '5m' }
  );

  res.cookie('sessionid', SESSION_ID, { httpOnly: true });
  res.json({ token, challenge });
});

// 🧠 Protected Route
router.all('/', (req, res, next) => {
  const method = req.method;
  const userAgent = req.headers['user-agent'];
  const contentType = req.headers['content-type'];
  const customHeader = req.headers['x-custom-header'];
  const cookie = req.cookies.sessionid;
  const authHeader = req.headers['authorization'];
  const signature = req.headers['x-payload-signature'];

  // Block browsers
  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ error: 'Browser access blocked.' });
  }

  // Enforce DELETE
  if (method !== 'DELETE') {
    return res.status(405).json({ error: `Use DELETE instead of ${method}.` });
  }

  // Content-Type check
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({ error: 'Set Content-Type to application/json.' });
  }

  // Custom header check
  if (!customHeader || customHeader.toLowerCase() !== 'secretvalue') {
    return res.status(400).json({ error: 'Missing or incorrect X-Custom-Header.' });
  }

  // Cookie check
  if (!cookie || cookie !== SESSION_ID) {
    return res.status(401).json({ error: 'Invalid sessionid cookie.' });
  }

  // JWT check
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  // Time-based access
  const now = Math.floor(Date.now() / 1000);
  if (now - decoded.iat > 300) {
    return res.status(403).json({ error: 'Token expired. Try again within 5 minutes.' });
  }

  // Payload signature check
  const payload = JSON.stringify(req.body);
  const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  if (signature !== expectedSig) {
    return res.status(400).json({ error: 'Invalid payload signature.' });
  }

  // Challenge-response check
  const { challenge, response } = req.body;
  const expectedResponse = crypto.createHash('md5').update(decoded.challenge).digest('hex');
  if (response !== expectedResponse) {
    return res.status(400).json({ error: 'Incorrect challenge response.' });
  }

  req.user = decoded;
  next();
});

// 🎁 Final Flag
router.delete('/', (req, res) => {
  const role = req.user.role;
  let flag;

  if (role === 'admin') {
    flag = 'FLAG{admin_mastermind_verified}';
  } else if (role === 'student') {
    flag = 'FLAG{student_solved_the_layers}';
  } else {
    return res.status(403).json({ error: 'Unknown role.' });
  }

  res.json({
    flag,
    message: '✅ All challenge layers passed. Flag unlocked!'
  });
});

module.exports = router;


// first of get you jwt token and cookies
/*
curl -X POST http://localhost:3000/classwork8/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student","password":"pass123"}'
// This will return a JWT token and set a session cookie.



# Assume challenge = "abc123xyz" from login response
# Generate response and signature:  Generate MD5 Response:
RESPONSE=$(echo -n "abc123xyz" | md5sum | awk '{print $1}')

# Generate HMAC Signature:
SIGNATURE=$(echo -n '{"challenge":"abc123xyz","response":"'$RESPONSE'"}' | openssl dgst -sha256 -hmac "your_secret_key" | awk '{print $2}')

curl -X DELETE http://localhost:3000/classwork8 \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: secretvalue" \
  -H "Authorization: Bearer <your_token>" \
  -H "X-Payload-Signature: $SIGNATURE" \
  --cookie "sessionid=valid_session" \
  -d '{"challenge":"abc123xyz","response":"'$RESPONSE'"}'
// This will test the DELETE route with the required headers and cookie.
// Make sure to replace <your_token> with the actual JWT token received from the login route
// and "valid_session" with the actual session ID set in your application.
// Ensure that the SECRET_KEY and SESSION_ID in config.js match those used in your application.
// The response will include the flag based on the user's role.
// The code is designed to be modular, allowing it to be easily integrated into a larger Express application.
 * The code is structured to provide clear error messages for each validation step, making it suitable for educational or challenge purposes.
 * The flag is a placeholder and should be replaced with an actual flag value in a real application.
 * The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
 * The code is designed to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
 * The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
 * The code is designed to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
 * The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
*/