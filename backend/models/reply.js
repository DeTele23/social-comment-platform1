// models/Reply.js
const db = require('../config/db');

class Reply {
  // Create a new reply
  static async create(commentId, userId, replyText) {
    try {
      const [result] = await db.execute(
        'INSERT INTO Replies (comment_id, user_id, reply_text) VALUES (?, ?, ?)',
        [commentId, userId, replyText]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get a single reply by ID
  static async getById(replyId) {
    try {
      const [rows] = await db.execute(`
        SELECT r.reply_id, r.reply_text, r.created_at, r.updated_at,
               r.user_id, u.username, r.comment_id
        FROM Replies r
        JOIN Users u ON r.user_id = u.user_id
        WHERE r.reply_id = ?
      `, [replyId]);
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update a reply
  static async update(replyId, replyText) {
    try {
      const [result] = await db.execute(
        'UPDATE Replies SET reply_text = ? WHERE reply_id = ?',
        [replyText, replyId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete a reply
  static async delete(replyId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM Replies WHERE reply_id = ?',
        [replyId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Reply;