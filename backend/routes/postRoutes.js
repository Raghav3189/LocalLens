const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const {
  createPost,
  getNearbyPosts,
  getAllPosts,
  getPostById,
  likePost,
  commentOnPost,
  getTopPosts,
} = require("../controllers/postController");

// frontend sends text+images
//Multer : a middleware that helps Express handle file uploads.
//upload : the Multer instance created earlier
//.array("images", 5) : tells Multer to expect multiple files under the field name "images", and allow up to 5 files max
router.post("/create", upload.array("images", 5), createPost);

// 📊 Top posts — specific route first
router.get("/top", getTopPosts);

// 🧭 Nearby posts
router.get("/nearby", getNearbyPosts);

// 📋 All posts
router.get("/", getAllPosts);

// 🔍 Single post by ID
router.get("/:id", getPostById);

// ❤️ Like a post
router.put("/:id/like",protect, likePost);

// 💬 Comment on a post
router.post("/:id/comment",protect, commentOnPost);




module.exports = router;
