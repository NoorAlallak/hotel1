const { User } = require("../Models/Associations");
const { authenticate } = require("../Middleware/AuthMiddleware");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role"],
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.post("/", async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hash,
      role: role && role.trim() ? role.toLowerCase() : "viewer",
    });
    res.status(201).json({
      message: "User created successfully",
      userId: newUser.id,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/profile", authenticate, async (req, res) => {
  try {
    const { username, email, oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    if (newPassword) {
      if (!oldPassword)
        return res.status(400).json({ message: "Old password is required." });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Old password is incorrect." });

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
module.exports = router;
