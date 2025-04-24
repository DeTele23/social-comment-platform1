const sql = require("mssql");
const config = require("../dbConfig");

module.exports = async function (context, req) {
  context.log("🔁 Register function called");
  const { username, email, password } = req.body || {};
  context.log("📩 Incoming data:", { username, email });

  if (!username || !email || !password) {
    context.log("❌ Missing fields");
    context.res = {
      status: 400,
      body: { message: "All fields are required." }
    };
    return;
  }

  try {
    await sql.connect(config);
    context.log("🛠️ Connected to DB");

    const check = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
    context.log("🔎 User exists check complete");

    if (check.recordset.length > 0) {
      context.res = {
        status: 409,
        body: { message: "Username already exists." }
      };
      return;
    }

    await sql.query`
      INSERT INTO Users (username, email)
      VALUES (${username}, ${email})
      `;
    await sql.query`
      INSERT INTO Passwords (password_hash)
      VALUES (${password_hash})
    `;

    context.log("✅ User registered");

    context.res = {
      status: 201,
      body: { message: "Registration successful." }
    };
  } catch (err) {
    context.log("💥 Error occurred:", err.message);
    context.res = {
      status: 500,
      body: { message: "Registration failed", error: err.message }
    };
  }
};
