const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

// Hashing Password by bcrypt
const hashPassword = async (password) => {
  return bcrypt.hash(password, saltRounds);
};

// Generate JWT
const generateToken = ({ id, username }) => {
  return jwt.sign({ id, username }, process.env.SECRET_KEY, {
    expiresIn: "2d",
  });
};

module.exports = { hashPassword, generateToken };
