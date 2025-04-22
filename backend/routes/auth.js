// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/user', authMiddleware, authController.getCurrentUser);

// Update password (protected route)
router.put('/password', authMiddleware, authController.updatePassword);

// Logout
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;