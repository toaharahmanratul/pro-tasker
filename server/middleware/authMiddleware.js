require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = { _id: decoded.id };
        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({
          message: "Invalid token!",
        });
      }
    } else {
      res.status(401).json({
        message: "Token not provided!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: "Unauthorized user!",
    });
  }
};

module.exports = { authMiddleware };
