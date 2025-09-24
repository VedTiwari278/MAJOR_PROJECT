const express = require("express");
const route = express.Router();

const controller = require("../Controller/AuthController");

route.post("/register-user", controller.RegisterUser);

route.post("/login-user", controller.LoginUser);

module.exports = route;
