
// ==========================================
// FILE: classwork14.js - Response Header Injection
// ==========================================
const express = require('express');
const router = express.Router();

// Search endpoint - VULNERABLE to header injection
router.get('/search', (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  // VULNERABILITY: Reflecting user input in headers without sanitization
  // This can lead to HTTP Response Splitting in some contexts
  try {
    res.set('X-Search-Query', query);
    res.set('X-Search-Results', '5');
    
    // Check if user injected newlines to add custom headers
    const customFlag = req.headers['x-injected-header'];
    
    if (customFlag === 'injected-by-attacker') {
      return res.json({
        flag: 'FLAG{response_header_injection_detected}',
        message: 'You successfully injected a custom header!',
        results: [],
        warning: 'Header injection can lead to response splitting attacks!'
      });
    }

    res.json({
      query: query,
      results: ['Result 1', 'Result 2', 'Result 3'],
      hint: 'Try using a proxy to inject X-Injected-Header: injected-by-attacker'
    });
  } catch (err) {
    res.status(500).json({ error: 'Invalid characters in query' });
  }
});

// Redirect endpoint - VULNERABLE to open redirect via response manipulation
router.get('/redirect', (req, res) => {
  const target = req.query.target || '/dashboard';

  // VULNERABILITY: Allows arbitrary redirects
  res.set('X-Redirect-Target', target);
  
  // If user manipulated response to change X-Redirect-Target header
  if (req.query.manipulated === 'true') {
    return res.json({
      flag: 'FLAG{open_redirect_via_header_manipulation}',
      message: 'You manipulated the redirect target!',
      warning: 'Always whitelist redirect targets!'
    });
  }

  res.redirect(target);
});

module.exports = router;
