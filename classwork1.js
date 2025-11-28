const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  const expectedMethod = 'GET';
  const actualMethod = req.method;
  const acceptHeader = req.headers['accept'];
  const userAgent = req.headers['user-agent'];
  const apiVersion = req.headers['x-api-version'];

  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({
      error: 'Browser access denied',
      hint: 'Use curl, Postman, or Thunder Client instead'
    });
  }

  if (actualMethod !== expectedMethod) {
    return res.status(405).json({
      error: `Method ${actualMethod} not allowed`,
      hint: 'Try a method used to retrieve data'
    });
  }

  if (!acceptHeader || !acceptHeader.includes('application/json')) {
    return res.status(406).json({
      error: 'Missing Accept header',
      hint: 'Set Accept: application/json'
    });
  }

  if (!apiVersion || apiVersion !== 'v1') {
    return res.status(400).json({
      error: 'Missing or invalid API version',
      hint: 'Add header: X-API-Version: v1'
    });
  }

  res.json({
    flag: 'FLAG{http_get_with_headers_success!}',
    message: '✅ Challenge 1 completed!',
    nextChallenge: '/classwork2'
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