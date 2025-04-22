// routes/comments.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

// Get all comments (public)
router.get('/', commentController.getAllComments);

// Get user's own comments (protected)
router.get('/user', authMiddleware, commentController.getUserComments);

// Get a single comment (public)
router.get('/:id', commentController.getComment);

// Create a comment (protected)
router.post('/', authMiddleware, commentController.createComment);

// Update a comment (protected)
router.put('/:id', authMiddleware, commentController.updateComment);

// Delete a comment (protected)
router.delete('/:id', authMiddleware, commentController.deleteComment);

// Add a reply to a comment (protected)
router.post('/:id/replies', authMiddleware, commentController.addReply);

// Delete a reply (protected)
router.delete('/:id/replies/:replyId', authMiddleware, commentController.deleteReply);

module.exports = router;