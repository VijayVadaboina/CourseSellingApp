const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next) {
  const token = req.headers.token;
  const verifyToken = jwt.verify(token, JWT_ADMIN_PASSWORD);
  if (verifyToken) {
    req.userId = verifyToken.id;
    next();
  } else {
    res.status(403).json({
      message: "Invalid token",
    });
  }
}

module.exports = {
  adminMiddleware: adminMiddleware,
};
