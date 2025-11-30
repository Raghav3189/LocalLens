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

router.get("/top", getTopPosts);

router.get("/nearby", getNearbyPosts);

router.get("/", getAllPosts);

router.get("/:id", getPostById);

router.put("/:id/like",protect, likePost);

router.post("/:id/comment",protect, commentOnPost);

module.exports = router;
