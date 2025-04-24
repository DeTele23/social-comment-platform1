const sql = require("mssql");
const config = require("../dbConfig");

module.exports = async function (context, req) {
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { message: "Register endpoint working!" }
    };
  };