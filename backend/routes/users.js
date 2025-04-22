// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const authMiddleware = require('../middleware/auth');

// Get user by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't expose sensitive data
    res.json({
      id: user.user_id,
      username: user.username,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;