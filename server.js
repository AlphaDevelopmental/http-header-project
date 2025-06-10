const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
//Global rate limiter: 100 requests per 15 mins per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests from this IP. Please try again later.'
  }
});
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many login attempts. Try again after 5 minutes.'
  },
  skip: (req, res) => {
    const myIP = '123.456.789.0'; // Replace this with your actual IP address
    return req.ip === myIP;
  }
});
//Apply global rate limiter to all routes 102.89.82.207 
app.use(limiter);
//Middleware to parse JSON and cookies
app.use(express.json()); 
app.use(cookieParser()); 
// Serve static files like login.html from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const loginRoute = require('./login');
const protectedRoute = require('./protected');
const classwork1 = require('./classwork1');
const classwork2 = require('./classwork2');
const classwork3 = require('./classwork3');
const classwork4 = require('./classwork4');
const classwork5 = require('./classwork5');
const classwork6 = require('./classwork6');
const classwork7 = require('./classwork7');
//Apply login-specific limiter before /login
app.use('/login', loginLimiter, loginRoute);
app.use('/protected', protectedRoute);
app.use('/classwork1', classwork1);
app.use('/classwork2', classwork2);
app.use('/classwork3', classwork3);
app.use('/classwork4', classwork4);
app.use('/classwork5', protectedRoute, classwork5);
app.use('/classwork6', protectedRoute, classwork6);
app.use('/classwork7', protectedRoute, classwork7);
app.get('/', (req, res) => {
  res.send('Welcome to the HTTP Header Challenge Server. Use /login to get started.');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;