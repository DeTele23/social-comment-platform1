// models/Password.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

class Password {
  // Store password for user
  static async create(userId, password) {
    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      const [result] = await db.execute(
        'INSERT INTO Passwords (user_id, password_hash) VALUES (?, ?)',
        [userId, passwordHash]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get password by user ID
  static async findByUserId(userId) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM Passwords WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(userId, plainPassword) {
    try {
      const password = await this.findByUserId(userId);
      if (!password) {
        return false;
      }
      
      return bcrypt.compare(plainPassword, password.password_hash);
    } catch (error) {
      throw error;
    }
  }

  // Update password
  static async update(userId, newPassword) {
    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);
      
      const [result] = await db.execute(
        'INSERT INTO Passwords (user_id, password_hash) VALUES (?, ?)',
        [userId, passwordHash]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Password;