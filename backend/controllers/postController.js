const Post = require("../models/Post");
const h3 = require("h3-js");

/* ---------------- CREATE POST ---------------- */
exports.createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      postType, // 🔹 new
    } = req.body;

    if (!title || !description || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    // 🔹 HARD validation (don’t rely only on Mongoose)
    const allowedTypes = ["complaint", "concern", "normal"];
    if (postType && !allowedTypes.includes(postType)) {
      return res.status(400).json({ message: "Invalid post type" });
    }

    const imageUrls = req.files?.map((file) => file.path) || [];

    const post = new Post({
      title: title.trim(),
      description: description.trim(),
      latitude: lat,
      longitude: lng,
      user: req.user.id,
      images: imageUrls,

      // 🔹 new fields
      postType: postType || "normal",

      // 🔒 status intentionally NOT taken from req.body
      // default = "active"
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- DISTANCE HELPER ---------------- */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* ---------------- NEARBY POSTS ---------------- */
exports.getNearbyPosts = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Coordinates required" });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const searchRadius = Number(radius);

    const resolution = 8;
    const userHex = h3.latLngToCell(lat, lng, resolution);

    // ✅ NO MAGIC NUMBERS
    const edgeKm = h3.getHexagonEdgeLengthAvg(resolution, "km");
    const HEX_CENTER_DISTANCE_KM = edgeKm * 2;

    const steps = Math.ceil(searchRadius / HEX_CENTER_DISTANCE_KM);
    const nearbyHexes = h3.gridDisk(userHex, steps);

    const posts = await Post.find({
      h3Index: { $in: nearbyHexes },
    })
      .sort({ createdAt: -1 })
      .limit(50);

    // ✅ EXACT DISTANCE FILTER
    const filteredPosts = posts.filter((post) => {
      const distance = haversineKm(
        lat,
        lng,
        post.latitude,
        post.longitude
      );
      return distance <= searchRadius;
    });

    res.status(200).json({ posts: filteredPosts });
  } catch (error) {
    console.error("Error fetching nearby posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET ALL ---------------- */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET BY ID ---------------- */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ post });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Error fetching post" });
  }
};


/* ---------------- LIKE / UNLIKE ---------------- */
exports.likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likedBy.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
    } else {
      post.likedBy.push(userId);
    }

    post.likes = post.likedBy.length;
    await post.save();

    res.json({ liked: !alreadyLiked, likes: post.likes });
  } catch {
    res.status(500).json({ message: "Error liking post" });
  }
};

/* ---------------- COMMENT ---------------- */
exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔥 insert newest first
    post.comments.unshift({
      user: req.user.id,
      text: text.trim(),
    });

    await post.save();

    // 🔥 populate MUST work now (schema ref fixed)
    await post.populate({
      path: "comments.user",
      select: "name email",
    });

    res.json({ post });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Error adding comment" });
  }
};



/* ---------------- TOP POSTS ---------------- */
exports.getTopPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ likes: -1 }).limit(5);
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Error fetching top posts" });
  }
};

/* ---------------- PROFILE ---------------- */
exports.getMyPosts = async (req, res) => {
  const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(posts);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.user.toString() !== req.user.id)
    return res.status(403).json({ error: "Not authorized" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // ownership check
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const {
      title,
      description,
      latitude,
      longitude,
      postType, // ✅ added
    } = req.body;

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (postType !== undefined) post.postType = postType; // ✅ added

    // update location if changed
    if (latitude !== undefined && longitude !== undefined) {
      post.latitude = latitude;
      post.longitude = longitude;
    }

    await post.save();

    res.json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};


/* ---------------- UPDATE POST STATUS ---------------- */
exports.updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔒 OWNER CHECK (non-negotiable)
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.status = status;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
