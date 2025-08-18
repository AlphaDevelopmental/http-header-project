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

  // Whitelist of allowed clients
  const allowedAgents = ['curl', 'postman', 'thunder'];
  const isAllowedClient = allowedAgents.some(agent =>
    userAgent && userAgent.toLowerCase().includes(agent)
  );

  // Step 1: Check User-Agent
  if (!isAllowedClient) {
    return res.status(403).json({
      error: 'Browser Not Allowed. Use curl, Postman, or Thunder Client.'
    });
  }

  // Step 2: Check HTTP Method
  if (method !== 'POST') {
    return res.status(405).json({ 
      error: `You used ${method}. This challenge requires a POST request.` 
    });
  }

  // Step 3: Check Content-Type
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(415).json({
      error: 'Content-Type header must be application/json'
    });
  }

  // Step 4: Check Query Parameter (less obvious hint)
  if (!name || !validNames.includes(name.toLowerCase())) {
    return res.status(400).json({
      error: 'Missing query parameter "name". Try common names from the team.'
    });
  }

  // Step 5: Check Accept Header
  if (!acceptHeader || !acceptHeader.includes('application/json')) {
    return res.status(406).json({ 
      error: 'Accept header must include application/json' 
    });
  }

  // Step 6: Check Challenge Token
  if (!challengeToken || challengeToken !== 'ctf-challenge-2025') {
    return res.status(401).json({
      error: 'Missing or invalid X-Challenge-Token header'
    });
  }

  // Step 7: Check JSON Body
  if (!bodyCode || bodyCode !== 'ladiesfirst') {
    return res.status(422).json({
      error: 'Missing or incorrect "code" field in JSON body'
    });
  }

  // Success!
  res.json({
    flag: 'FLAG{post_query_headers_body_validated!}',
    message: `Hi ${name}, you've mastered multi-layered HTTP validation!`
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
