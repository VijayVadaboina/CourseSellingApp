const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_USER_PASSWORD } = process.env.JWT_USER_PASSWORD;

function userMiddleware(req, res, next) {
  const token = req.headers.token;
  const verifyToken = jwt.verify(token, JWT_USER_PASSWORD);
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
  userMiddleware: userMiddleware,
};
