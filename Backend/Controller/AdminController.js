const express = require("express");
const Menu = require("../Model/AddMenu");
const { cloudinary } = require("../config/cloudinary");
exports.AddMenu = async (req, res) => {
  try {
    console.log("Cloudinary Response:", req.file); // yaha secure_url aayega
    console.log("Body:", req.body);

    const { name, category, description, price } = req.body;

    const menu = new Menu({
      name,
      category,
      description,
      price,
      imageUrl: req.file?.path,
      imagePublicId: req.file?.filename,
    });

    await menu.save();

    return res.status(200).json({
      message: "Menu added Successfully!",
      data: menu,
    });
  } catch (err) {
    console.error("AddMenu Error:", err);
    return res.status(500).json({ message: "Error adding menu item" });
  }
};

exports.DeleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (menu.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(menu.imagePublicId);
        console.log("Cloudinary image deleted:", menu.imagePublicId);
      } catch (err) {
        console.warn("Cloudinary delete failed:", err.message);
      }
    }

    const deletedMenu = await Menu.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Item Deleted Successfully",
      data: deletedMenu,
    });
  } catch (err) {
    console.error("DeleteMenuItem Error:", err);
    return res.status(500).json({ message: "Error deleting menu item" });
  }
};

exports.UpdateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price } = req.body;
    // 1. DB se menu find karo
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    // 2. Agar nayi image aayi hai
    let imageUrl = menu.imageUrl;
    let imagePublicId = menu.imagePublicId;
    if (req.file) {
      // Purani image delete kar Cloudinary se
      if (menu.imagePublicId) {
        await cloudinary.uploader.destroy(menu.imagePublicId);
      }
      // Nayi image ka path aur public_id save karo
      imageUrl = req.file.path; //  Cloudinary secure_url
      imagePublicId = req.file.filename; //  Cloudinary public_id
    }
    // 3. Update DB
    const updated = await Menu.findByIdAndUpdate(
      id,
      { name, description, category, price, imageUrl, imagePublicId },
      { new: true }
    );

    return res.status(200).json({
      message: "Item Edited Successfully!",
      data: updated,
    });
  } catch (err) {
    console.error("UpdateMenuItem Error:", err);
    return res.status(500).json({ message: "Error while Editing menu Item!" });
  }
};
