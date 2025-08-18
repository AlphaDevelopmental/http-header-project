const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  const expectedMethod = 'OPTIONS';
  const actualMethod = req.method;
  const contentType = req.headers['content-type'];
  const userAgent = req.headers['user-agent'];
  const optionsToken = req.headers['x-options-token'];
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  const accessControl = req.headers['access-control-request-method'];

  // Step 1: Block browser access
  const allowedAgents = ['curl', 'postman', 'thunder'];
  const isAllowedClient = allowedAgents.some(agent =>
    userAgent && userAgent.toLowerCase().includes(agent)
  );

  if (!isAllowedClient) {
    return res.status(403).json({
      error: 'Access denied. Use curl, Postman, or Thunder Client — Browser Not Allowed.'
    });
  }

  // Step 2: Method must be OPTIONS
  if (actualMethod !== expectedMethod) {
    return res.status(405).json({
      error: `Method Not Allowed. Hint: Try a method used for preflight requests instead of ${actualMethod}.`
    });
  }

  // Step 3: Content-Type validation
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({
      error: 'Content-Type must be application/json'
    });
  }

  // Step 4: Options Token (more realistic)
  if (!optionsToken || optionsToken !== 'cors-preflight-2024') {
    return res.status(401).json({
      error: 'Missing or invalid X-Options-Token header'
    });
  }

  // Step 5: Origin validation (more specific)
  const validOrigins = ['https://api.ctf.local', 'http://localhost:3000'];
  const originMatch = origin && validOrigins.some(validOrigin => 
    origin.toLowerCase() === validOrigin.toLowerCase()
  );
  
  if (!originMatch) {
    return res.status(403).json({
      error: 'Invalid Origin header. Must be from approved domain.'
    });
  }

  // Step 6: CORS preflight header (teaches real CORS)
  if (!accessControl || accessControl.toUpperCase() !== 'POST') {
    return res.status(400).json({
      error: 'Missing Access-Control-Request-Method header. Set to POST.'
    });
  }

  // Success - proper CORS preflight response
  res.set({
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Options-Token'
  });

  res.json({
    flag: 'FLAG{options_cors_preflight_mastered!}',
    message: 'Excellent! You understand CORS preflight requests!'
  });
});

module.exports = router;
// This code defines an Express.js route that checks the HTTP method, Content-Type header, and other headers for OPTIONS requests.
// If the method is not OPTIONS, it responds with a 405 status code and an error message.
// If the Content-Type is not application/json, it responds with a 415 status code and an error message.
// If the X-Options-Token header is missing or invalid, it responds with a 401 status code and an error message.
// If the Origin header does not match a list of valid origins, it responds with a 403 status code and an error message.
// If the Access-Control-Request-Method header is missing or not set to POST, it responds with a 400 status code and an error message.
// If all checks pass, it sets the appropriate CORS headers and responds with a JSON object containing a flag and a success message.
// The route is exported as a module for use in an Express application.
// The code is designed to provide a challenge for users to pass by using the correct method and headers.
// The flag is a placeholder and should be replaced with an actual flag value
/*
curl -X OPTIONS http://localhost:3000/classwork4 \
  -H "Content-Type: application/json" \
  -H "User-Agent: curl/7.85.0" \
  -H "X-Options-Token: cors-preflight-2024" \
  -H "Origin: https://api.ctf.local" \
  -H "Access-Control-Request-Method: POST"

  curl -X OPTIONS http://localhost:3000/classwork4 \
  -H "Content-Type: application/json" \
  -H "User-Agent: curl/7.85.0" \
  -H "X-Options-Token: cors-preflight-2024" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
*/