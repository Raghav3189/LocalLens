const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");
const { updatePost } = require("../controllers/postController");

router.put("/:id", protect, updatePost);


const postController = require("../controllers/postController");

// ---------------- CREATE ----------------
// frontend sends text+images 
//Multer : a middleware that helps Express handle file uploads. 
//upload : the Multer instance created earlier
//.array("images", 5) : tells Multer to expect multiple files under the field name "images", and allow up to 5 files max
router.post(
  "/create",
  protect,                     // 🔴 REQUIRED
  upload.array("images", 5),
  postController.createPost
);

// ---------------- READ (ORDER MATTERS) ----------------
router.get("/my", protect, postController.getMyPosts); // 🔴 BEFORE :id

router.get("/top", postController.getTopPosts);

router.get("/nearby", postController.getNearbyPosts);

router.get("/", postController.getAllPosts);

router.get("/:id", postController.getPostById);

// ---------------- INTERACTIONS ----------------
router.put("/:id/like", protect, postController.likePost);

router.post("/:id/comment", protect, postController.commentOnPost);

// ---------------- DELETE ----------------
router.delete("/:id", protect, postController.deletePost);


router.put("/:id", protect, updatePost);

router.patch("/:id/status", protect, postController.updatePostStatus);

module.exports = router;
