const User = require("../models/user.model");

const getAllTodos = async (req, res) => {
  try {
    const { _id, username, todos } = await User.findById(req.user._id).select(
      "-password"
    );
    return res.status(200).send({
      success: true,
      user: {
        id: _id,
        username,
        todos,
      },
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      error: error.message,
    });
  }
};

const addTodo = async (req, res) => {
  try {
    const description = req.body.description;
    const newTodo = {
      tag: "UNDONE",
      description,
    };
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { todos: newTodo },
      },
      { new: true }
    ).select("-password");

    return res.status(200).send({
      success: true,
      message: "Todo added successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        todos: updatedUser.todos,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to add todo",
      error: error.message,
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { todos: { _id: todoId } },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        todos: updatedUser.todos,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete todo",
      error: error.message,
    });
  }
};

const editTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const newDescription = req.body.description;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, "todos._id": todoId },
      { $set: { "todos.$.description": newDescription } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        todos: updatedUser.todos,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update todo",
      error: error.message,
    });
  }
};

const markComplete = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const isComplete = req.query.isComplete === "true";

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, "todos._id": todoId },
      { $set: { "todos.$.tag": isComplete ? "DONE" : "UNDONE" } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Todo tag updated to ${
        isComplete ? "DONE" : "UNDONE"
      } successfully`,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        todos: updatedUser.todos,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update todo tag",
      error: error.message,
    });
  }
};

module.exports = { getAllTodos, addTodo, editTodo, deleteTodo, markComplete };
