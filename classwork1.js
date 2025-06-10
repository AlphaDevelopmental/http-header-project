const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  const expectedMethod = 'GET';
  const actualMethod = req.method;
  const contentType = req.headers['content-type'];
  const userAgent = req.headers['user-agent'];

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

  // Step 2: Check for Content-Type: application/json
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({
      error: 'Nice try! But you must set Content-Type to application/json'
    });
  }

  // Success
  res.json({
    flag: 'FLAG{http_get_with_json_success! }',
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