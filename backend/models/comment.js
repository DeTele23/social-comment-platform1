// models/Comment.js
const db = require('../config/db');

class Comment {
  // Create a new comment
  static async create(userId, commentText) {
    try {
      const [result] = await db.execute(
        'INSERT INTO Comments (user_id, comment_text) VALUES (?, ?)',
        [userId, commentText]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get all comments with user information
  static async getAll() {
    try {
      const [rows] = await db.execute(`
        SELECT c.comment_id, c.comment_text, c.created_at, c.updated_at,
               u.user_id, u.username
        FROM Comments c
        JOIN Users u ON c.user_id = u.user_id
        ORDER BY c.created_at DESC
      `);
      
      // Get replies for each comment
      for (let comment of rows) {
        comment.replies = await this.getReplies(comment.comment_id);
      }
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get comments by user ID
  static async getByUserId(userId) {
    try {
      const [rows] = await db.execute(`
        SELECT c.comment_id, c.comment_text, c.created_at, c.updated_at
        FROM Comments c
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `, [userId]);
      
      // Get replies for each comment
      for (let comment of rows) {
        comment.replies = await this.getReplies(comment.comment_id);
      }
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a single comment by ID
  static async getById(commentId) {
    try {
      const [rows] = await db.execute(`
        SELECT c.comment_id, c.comment_text, c.created_at, c.updated_at, 
               c.user_id, u.username
        FROM Comments c
        JOIN Users u ON c.user_id = u.user_id
        WHERE c.comment_id = ?
      `, [commentId]);
      
      if (rows.length === 0) {
        return null;
      }
      
      // Get replies for the comment
      rows[0].replies = await this.getReplies(commentId);
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update a comment
  static async update(commentId, commentText) {
    try {
      const [result] = await db.execute(
        'UPDATE Comments SET comment_text = ? WHERE comment_id = ?',
        [commentText, commentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete a comment
  static async delete(commentId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM Comments WHERE comment_id = ?',
        [commentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get replies for a comment
  static async getReplies(commentId) {
    try {
      const [rows] = await db.execute(`
        SELECT r.reply_id, r.reply_text, r.created_at, r.updated_at,
               r.user_id, u.username
        FROM Replies r
        JOIN Users u ON r.user_id = u.user_id
        WHERE r.comment_id = ?
        ORDER BY r.created_at ASC
      `, [commentId]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Comment;