
// ==========================================
// DEFENSE TUTORIAL CODE
// FILE: classwork11-secure.js
// ==========================================

// SECURE VERSION - Price Manipulation Defense

const express = require('express');
const router = express.Router();

const products = {
  'PROD001': { name: 'Premium Laptop', price: 1500, discount: 0 }
};

router.get('/product/:id', (req, res) => {
  const productId = req.params.id;
  const product = products[productId];

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // SECURE: Only send necessary data, calculate price server-side
  res.json({
    id: productId,
    name: product.name,
    displayPrice: product.price // For display only
    // Never send finalPrice that client can manipulate
  });
});

router.post('/purchase', (req, res) => {
  const { productId } = req.body;
  const product = products[productId];

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // SECURE: ALWAYS recalculate on server-side
  const finalPrice = product.price * (1 - product.discount);

  // Process payment with SERVER-CALCULATED price
  res.json({
    message: 'Purchase successful',
    charged: finalPrice
  });
});

module.exports = router;