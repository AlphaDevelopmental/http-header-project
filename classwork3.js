const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  const method = req.method;
  const name = req.query.name;
  const acceptHeader = req.headers['accept'];
  const userAgent = req.headers['user-agent'];
  const challengeToken = req.headers['x-challenge-token'];
  const contentType = req.headers['content-type'];
  const bodyCode = req.body?.code;

  const validNames = ['daniel', 'ibukunoluwa'];
  const allowedAgents = ['curl', 'postman', 'thunder'];
  const isAllowedClient = allowedAgents.some(agent =>
    userAgent && userAgent.toLowerCase().includes(agent)
  );

  if (!isAllowedClient) {
    return res.status(403).json({
      error: 'Browser not allowed',
      hint: 'Use curl, Postman, or Thunder Client'
    });
  }

  if (method !== 'POST') {
    return res.status(405).json({ 
      error: `Method ${method} not allowed`,
      hint: 'Use POST method'
    });
  }

  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({
      error: 'Invalid Content-Type',
      hint: 'Set Content-Type: application/json'
    });
  }

  if (!name || !validNames.includes(name.toLowerCase())) {
    return res.status(400).json({
      error: 'Missing or invalid query parameter',
      hint: 'Add ?name=daniel or ?name=ibukunoluwa'
    });
  }

  if (!acceptHeader || !acceptHeader.includes('application/json')) {
    return res.status(406).json({ 
      error: 'Invalid Accept header',
      hint: 'Set Accept: application/json'
    });
  }

  if (!challengeToken || challengeToken !== 'ctf-challenge-2024') {
    return res.status(401).json({
      error: 'Missing or invalid challenge token',
      hint: 'Add header: X-Challenge-Token: ctf-challenge-2024'
    });
  }

  if (!bodyCode || bodyCode !== 'ladiesfirst') {
    return res.status(422).json({
      error: 'Invalid code in request body',
      hint: 'Send JSON: {"code": "ladiesfirst"}'
    });
  }

  res.json({
    flag: 'FLAG{post_query_headers_body_validated!}',
    message: `✅ Well done ${name}! Challenge 3 completed!`,
    nextChallenge: '/classwork4'
  });
});

module.exports = router;

// This code defines an Express.js route that checks the User-Agent, a query parameter, and the Accept header of incoming POST requests.
// If the User-Agent indicates a browser, it responds with a 403 status code.
// If the query parameter 'name' is missing, it responds with a 400 status code.
// If the Accept header is not set to 'application/json', it responds with a 406 status code.
// If all checks pass, it responds with a JSON object containing a flag and a personalized message.
// The route is exported as a module for use in an Express application.
// The code is designed to provide a simple challenge for users to pass by using the correct query parameters and headers.
// The flag is a placeholder and should be replaced with an actual flag value in a real application.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.
// The code is designed to provide feedback to the user about the checks they need to pass, making it suitable for educational or challenge purposes.
// The code is structured to be modular, allowing it to be easily integrated into a larger Express application.

// curl -H "Accept: application/json" "http://localhost:3000/?name=Simbiat"
// This curl command sends a GET request to the server with the required Accept header and query parameter.
/*
curl -X POST "http://localhost:3000/classwork3?name=ibukunoluwa" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "User-Agent: curl/7.85.0" \
  -H "X-Challenge-Token: ctf-challenge-2024" \
  -d '{"code": "ladiesfirst"}'

  curl -X POST "http://localhost:3000/classwork3?name=daniel" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "User-Agent: curl/7.85.0" \
  -H "X-Challenge-Token: ctf-challenge-2024" \
  -d '{"code": "ladiesfirst"}'
*/
