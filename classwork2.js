const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  const expectedMethod = 'POST';
  const method = req.method;
  const apiKey = req.headers['x-api-key'];
  const userAgent = req.headers['user-agent'];
  const contentType = req.headers['content-type'];
  const { action } = req.body;

  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ 
      error: 'Browser not allowed',
      hint: 'Use API client like curl or Postman'
    });
  }

  if (method !== expectedMethod) {
    return res.status(405).json({ 
      error: `Method ${method} not allowed`,
      hint: 'This challenge requires POST method'
    });
  }

  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({ 
      error: 'Invalid Content-Type',
      hint: 'Set Content-Type: application/json'
    });
  }

  if (apiKey !== 'ctf-api-key-2024') {
    return res.status(401).json({ 
      error: 'Missing or invalid API key',
      hint: 'Add header: X-API-Key: ctf-api-key-2024'
    });
  }

  if (!action || action !== 'authenticate') {
    return res.status(422).json({ 
      error: 'Invalid request body',
      hint: 'Send JSON body: {"action": "authenticate"}'
    });
  }

  res.json({
    flag: 'FLAG_CLASSWORK2=FLAG{post_json_api_key_verified!}',
    message: '✅ Challenge 2 completed!',
    nextChallenge: '/classwork3'
  });
});

module.exports = router;

// This code defines an Express.js route that checks the HTTP method, a custom header, and the User-Agent of incoming requests.
// If the User-Agent indicates a browser, it responds with a 403 status code.
// If the method is not POST, it responds with a 405 status code.
// If the custom header 'x-api-key' is missing or invalid, it responds with a 401 status code.
// If all checks pass, it responds with a JSON object containing a flag and a success message.
// The route is exported as a module for use in an Express application.
// The code is designed to provide a simple challenge for users to pass by using the correct method and headers.
// The flag is a placeholder and should be replaced with an actual flag value in a real application.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
// The code is designed to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
/*curl -X POST http://localhost:3000/classwork2 \
  -H "Content-Type: application/json" \
  -H "User-Agent: curl/7.85.0" \
  -H "X-API-Key: ctf-api-key-2024" \
  -d '{"action": "authenticate"}'
*/
