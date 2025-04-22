// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'scpserver1.database.windows.net',
  user: process.env.DB_USER || 'scpadmin',
  password: process.env.DB_PASSWORD || 'HelloWorld24',
  database: process.env.DB_NAME || 'Social-Comment-Platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit if database connection fails
  }
};

// Initial test
testConnection();

module.exports = pool;