const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  const expectedMethod = 'GET';
  const actualMethod = req.method;
  const acceptHeader = req.headers['accept'];
  const userAgent = req.headers['user-agent'];
  const apiVersion = req.headers['x-api-version'];

  // Step 0: Block browser access based on User-Agent
  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({
      error: 'Access denied. Use curl, Postman, or Thunder Client — Browser NOT Allowed.'
    });
  }

  // Step 1: Check if the method used is GET
  if (actualMethod !== expectedMethod) {
    return res.status(405).json({
      error: `Oops! ${actualMethod} is not allowed. Hint: Try another common method.`
    });
  }

  // Step 2: Check for Accept: application/json (more realistic for GET)
  if (!acceptHeader || !acceptHeader.includes('application/json')) {
    return res.status(406).json({
      error: 'Missing Accept header. Set Accept: application/json'
    });
  }

  // Step 3: Check for API version header (common in real APIs)
  if (!apiVersion || apiVersion !== 'v1') {
    return res.status(400).json({
      error: 'Missing or invalid X-API-Version header. Use "v1"'
    });
  }

  // Success
  res.json({
    flag: 'FLAG{http_get_with_headers_success!}',
    message: 'Awesome job! You used the right method and headers!'
  });
});

module.exports = router;

// This code defines an Express.js route that checks the HTTP method and Content-Type header of incoming requests.
// If the method is not GET, it responds with a 405 status code and an error message.
// If the Content-Type is not application/json, it responds with a 415 status code and an error message.
// If both checks pass, it responds with a JSON object containing a flag and a success message.
// The route is exported as a module for use in an Express application.
// The code is designed to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
// The flag is a placeholder and should be replaced with an actual flag value in a real application.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
/*
curl -X GET http://localhost:3000/classwork1 \
-H "Accept: application/json" \
-H "X-API-Version: v1" \
-H "User-Agent: curl/7.85.0"
*/