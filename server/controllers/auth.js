const { generateToken, hashPassword } = require("../lib/utils");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isUserExist = await User.findOne({ username: username });
    if (isUserExist) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      todos: [],
    });

    return res.status(200).send({
      success: true,
      message: "User is created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        todos: newUser.todos,
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const loginController = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).send({
      success: false,
      message: "User not found",
    });
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).send({
      success: false,
      message: "Incorrect password",
    });
  }
  const payload = {
    id: user._id,
    username: user.username,
  };
  const token = generateToken(payload);

  return res.status(200).send({
    success: true,
    message: "User is logged in successfully",
    token: "Bearer " + token,
  });
};

module.exports = { registerController, loginController };
