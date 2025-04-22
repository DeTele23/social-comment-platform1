// controllers/commentController.js
const Comment = require('../models/comment');
const Reply = require('../models/reply');

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.getAll();
    res.json(comments);
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comments by user
exports.getUserComments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const comments = await Comment.getByUserId(userId);
    res.json(comments);
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single comment
exports.getComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.getById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json(comment);
  } catch (error) {
    console.error('Get comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { commentText } = req.body;
    
    if (!commentText) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const commentId = await Comment.create(userId, commentText);
    const comment = await Comment.getById(commentId);
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const commentId = req.params.id;
    const { commentText } = req.body;
    
    if (!commentText) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    // Check if comment exists and belongs to user
    const comment = await Comment.getById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    // Update comment
    await Comment.update(commentId, commentText);
    
    const updatedComment = await Comment.getById(commentId);
    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const commentId = req.params.id;
    
    // Check if comment exists and belongs to user
    const comment = await Comment.getById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Delete comment
    await Comment.delete(commentId);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a reply to a comment
exports.addReply = async (req, res) => {
  try {
    const userId = req.user.userId;
    const commentId = req.params.id;
    const { replyText } = req.body;
    
    if (!replyText) {
      return res.status(400).json({ message: 'Reply text is required' });
    }
    
    // Check if comment exists
    const comment = await Comment.getById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Create reply
    const replyId = await Reply.create(commentId, userId, replyText);
    const reply = await Reply.getById(replyId);
    
    res.status(201).json(reply);
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a reply
exports.deleteReply = async (req, res) => {
  try {
    const userId = req.user.userId;
    const replyId = req.params.replyId;
    
    // Check if reply exists and belongs to user
    const reply = await Reply.getById(replyId);
    
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    
    if (reply.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }
    
    // Delete reply
    await Reply.delete(replyId);
    
    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};