const sql = require("mssql");
const config = require("../dbConfig");
const verifyToken = require("../verifyToken");

module.exports = async function (context, req) {
  const auth = verifyToken(req);

  if (!auth.valid) {
    context.res = {
      status: 401,
      body: { message: auth.message }
    };
    return;
  }

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Comments WHERE user_id = ${auth.decoded.id}`;
    context.res = {
      status: 200,
      body: result.recordset
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { message: "Failed to fetch comments", error: err.message }
    };
  }
};
