const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes from other files
const classwork1 = require('./classwork1');
const classwork2 = require('./classwork2');
const classwork3 = require('./classwork3');
const classwork4 = require('./classwork4');
const classwork5 = require('./classwork5');
const classwork6 = require('./classwork6');
const classwork7 = require('./classwork7');

// Use the imported routes
app.use('/classwork1', classwork1);
app.use('/classwork2', classwork2);
app.use('/classwork3', classwork3);
app.use('/classwork4', classwork4);
app.use('/classwork5', classwork5);
app.use('/classwork6', classwork6);
app.use('/classwork7', classwork7);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});