// ==========================================
// FILE: classwork11.js - Price Manipulation
// ==========================================
const express = require('express');
const router = express.Router();

// Simulated product database
const products = {
  'PROD001': { name: 'Premium Laptop', price: 1500, discount: 0 },
  'PROD002': { name: 'Gaming Mouse', price: 50, discount: 0 },
  'PROD003': { name: 'Mechanical Keyboard', price: 120, discount: 0 }
};

// GET product info - VULNERABLE to response manipulation
router.get('/product/:id', (req, res) => {
  const productId = req.params.id;
  const product = products[productId];

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // VULNERABILITY: Client can intercept and modify this response
  res.json({
    id: productId,
    name: product.name,
    price: product.price,
    discount: product.discount,
    finalPrice: product.price * (1 - product.discount),
    message: 'Intercept this response and change the price to 1!'
  });
});

// POST purchase - VULNERABLE (trusts client-provided price)
router.post('/purchase', (req, res) => {
  const { productId, finalPrice } = req.body;
  const product = products[productId];

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // VULNERABILITY: Server accepts finalPrice from client without validation!
  // In real scenarios, ALWAYS recalculate on server-side
  if (finalPrice <= 1) {
    return res.json({
      flag: 'FLAG{price_manipulation_client_side_trust_broken}',
      message: 'You successfully manipulated the price!',
      warning: 'Never trust client-provided prices in production!',
      purchaseDetails: {
        product: product.name,
        youPaid: finalPrice,
        actualPrice: product.price,
        savings: product.price - finalPrice
      }
    });
  }

  res.json({
    message: 'Purchase completed',
    hint: 'Try intercepting the /product/:id response and modifying the finalPrice to 1'
  });
});

module.exports = router;
// This code defines an Express.js router that simulates a product purchasing system vulnerable to client-side response manipulation. It includes two main endpoints: one for retrieving product information and another for making a purchase. The vulnerability lies in the fact that the server trusts the client-provided final price during the purchase process, allowing users to manipulate the price to their advantage.// query parameters, referer, and cookies. If all validations pass, it processes the OPTIONS request to return a flag.
// The route is exported as a module for use in an Express application.
// To test this route, you need to set the appropriate headers, query parameters, and body as specified in the validation middleware.