require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./router");

const app = express();
require("./config/database");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router(app);

module.exports = app;
