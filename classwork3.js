const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  const method = req.method;
  const name = req.query.name; 
  const acceptHeader = req.headers['accept'];
  const userAgent = req.headers['user-agent'];

  if (userAgent && userAgent.toLowerCase().includes('mozilla')) {
    return res.status(403).json({ error: 'Browser Not Allowed. Use curl, Postman, or Thunder Client.' });
  }
  if (method !== 'POST') {
   return res.status(405).json({ error: `You used ${method}. This challenge requires a POST request.` });
  }

  if (!name || name.toLowerCase() !== 'simbiat') {
  return res.status(400).json({ error: 'Include ?name=Name of the only lady among us in the query parameters.' });
  }

  if (!acceptHeader || !acceptHeader.includes('application/json')) {
    return res.status(406).json({ error: 'Header Accept: application/json is required.' });
  }
  // If all checks pass, respond with a success message and a flag
  res.json({ 
    flag: 'FLAG{post_with_query_and_accept_json}', 
    message: `Hi ${name}, challenge passed!` });
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