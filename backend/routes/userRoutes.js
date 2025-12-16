const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;
