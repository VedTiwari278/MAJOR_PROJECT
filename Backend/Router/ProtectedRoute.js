const express = require("express");
const route = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const controller = require("../Controller/AdminController");
const multer = require("multer");

const { storage } = require("../cloudinary"); // ✅ Cloudinary storage
const upload = multer({ storage });

// ✅ Add Menu
route.post(
  "/admin/add-menu-item",
  upload.single("imageUrl"), // file field ka naam "imageUrl" frontend se same hona chahiye
  authMiddleware,
  controller.AddMenu
);

// ✅ Delete Menu
route.delete(
  "/admin/delete-menu-item/:id",
  authMiddleware,
  controller.DeleteMenuItem
);

// ✅ Update Menu (fix: upload middleware lagaya)
route.put(
  "/admin/update-menu/:id",
  upload.single("imageUrl"), // 🔹 ab yaha bhi multer lagaya
  authMiddleware,
  controller.UpdateMenuItem
);

module.exports = route;
