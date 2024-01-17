const { registerController, loginController } = require("./controllers/auth");
const {
  getAllTodos,
  addTodo,
  deleteTodo,
  editTodo,
  markComplete,
} = require("./controllers/todo");
const { authMiddleware } = require("./middleware/authMiddleware");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send("Welcome to the server");
  });
  app.post("/register", registerController);
  app.post("/login", loginController);

  app.get("/todo", authMiddleware, getAllTodos);
  app.post("/todo", authMiddleware, addTodo);
  app.delete("/todo/:todoId", authMiddleware, deleteTodo);
  app.put("/todo/:todoId", authMiddleware, editTodo);
  app.patch("/todo/:todoId", authMiddleware, markComplete);

};
