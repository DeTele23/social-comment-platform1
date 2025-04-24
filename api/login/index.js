const sql = require("mssql");
const jwt = require("jsonwebtoken");
const config = require("../dbConfig");
require("dotenv").config();

module.exports = async function (context, req) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    context.res = {
      status: 400,
      body: { message: "Username and password required." }
    };
    return;
  }

  try {
    await sql.connect(config);

    const result = await sql.query`
      SELECT * FROM Users WHERE username = ${username} AND password = ${password}
    `;

    if (result.recordset.length === 0) {
      context.res = {
        status: 401,
        body: { message: "Invalid credentials." }
      };
      return;
    }

    const user = result.recordset[0];
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { message: "Login successful", token, username: user.username }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { message: "Login failed", error: err.message }
    };
  }
};