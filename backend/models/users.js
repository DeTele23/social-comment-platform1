// models/User.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Create new user
  static async create(username, email) {
    try {
      const [result] = await db.execute(
        'INSERT INTO Users (username, email) VALUES (?, ?)',
        [username, email]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM Users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM Users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(userId) {
    try {
      const [rows] = await db.execute(
        'SELECT user_id, username, email, created_at, updated_at FROM Users WHERE user_id = ?',
        [userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;