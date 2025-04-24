const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function verifyToken(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return { valid: false, message: "Token missing." };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, message: "Token invalid." };
  }
};
