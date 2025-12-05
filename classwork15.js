
// ==========================================
// FILE: classwork15.js - XSS via Response Manipulation
// ==========================================
const express = require('express');
const router = express.Router();

// Comment endpoint - VULNERABLE to stored XSS
router.post('/comment', (req, res) => {
  const { comment, author } = req.body;

  if (!comment || !author) {
    return res.status(400).json({ error: 'Missing comment or author' });
  }

  // VULNERABILITY: No sanitization, directly reflects user input
  res.json({
    success: true,
    comment: {
      id: Date.now(),
      author: author,
      text: comment, // DANGEROUS: Unsanitized user input
      timestamp: new Date().toISOString()
    },
    message: 'Comment posted! Check if XSS payload executes.',
    hint: 'Try posting: <script>alert("XSS")</script>'
  });
});

// View comments - VULNERABLE (renders unsanitized HTML)
router.get('/comments', (req, res) => {
  // Simulated stored comments
  const comments = [
    { 
      author: 'user1', 
      text: 'Nice article!',
      id: 1
    },
    { 
      author: 'user2', 
      text: 'Great work!',
      id: 2
    }
  ];

  // Check if user is requesting with XSS detection
  const detectXSS = req.query.detect;

  if (detectXSS === 'true') {
    return res.json({
      flag: 'FLAG{xss_response_manipulation_understood}',
      message: 'You understand XSS via response manipulation!',
      comments: comments,
      warning: 'Always sanitize output and use Content-Security-Policy headers!'
    });
  }

  // VULNERABILITY: Sends HTML with unsanitized content
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Comments</title>
    </head>
    <body>
      <h1>User Comments</h1>
      <div id="comments">
        ${comments.map(c => `
          <div class="comment">
            <strong>${c.author}</strong>: ${c.text}
          </div>
        `).join('')}
      </div>
      <p>Hint: Add ?detect=true to get the flag</p>
    </body>
    </html>
  `);
});

// API that demonstrates DOM-based XSS vulnerability
router.get('/profile', (req, res) => {
  const username = req.query.username || 'guest';

  // VULNERABILITY: Reflecting user input without encoding
  res.json({
    profile: {
      username: username, // Can contain XSS payload
      bio: 'Welcome to my profile!',
      joinDate: '2024-01-01'
    },
    hint: 'Try username=<img src=x onerror=alert(1)>',
    challenge: 'Manipulate response to inject XSS payload'
  });
});

module.exports = router;