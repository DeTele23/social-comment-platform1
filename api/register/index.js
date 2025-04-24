const sql = require("mssql");
const config = require("../dbConfig");

module.exports = async function (context, req) {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    context.res = {
      status: 400,
      body: { message: "All fields are required." }
    };
    return;
  }

  try {
    await sql.connect(config);

    const check = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
    if (check.recordset.length > 0) {
      context.res = {
        status: 409,
        body: { message: "Username already exists." }
      };
      return;
    }

    await sql.query`
      INSERT INTO Users (username, email, password)
      VALUES (${username}, ${email}, ${password})
    `;

    context.res = {
      status: 201,
      body: { message: "Registration successful." }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { message: "Registration failed.", error: err.message }
    };
  }
};