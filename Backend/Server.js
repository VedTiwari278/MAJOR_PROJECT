//Environment Variables
require("dotenv").config({ path: "./config/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//Local Route import begin

const Route = require("./Router/ProtectedRoute");
const MenuRoute = require("./Router/FrontendRouter");
const AuthRouter = require("./Router/AuthRouter");
const authMiddleware = require("./middleware/authmiddleware");

//Local Route import end

const app = express();
app.use(cors());
app.use(express.json());

// Route
app.get("/", (req, res) => {
  res.send({ status: 200, message: "Server activated" });
});

//This is Unprotected Routes
app.use(MenuRoute);

app.use(AuthRouter);

app.use(authMiddleware);

//This Protected Route
app.use(Route);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start server after DB connection
    app.listen(process.env.PORT, () => {
      console.log(
        `🚀 App is listening at ${process.env.BACKEND_HOST} ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB:", error.message);
  });
