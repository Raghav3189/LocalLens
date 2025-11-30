const Post = require("../models/Post");
const h3 = require("h3-js");
const cloudinary = require("cloudinary").v2;

const createPost = async (req, res) => {
  try {
    //req seperated into body and files by multer

    const { title, description, latitude, longitude, createdBy } = req.body;

    if (!title || !description || !latitude || !longitude || !createdBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const h3Index = h3.latLngToCell(Number(latitude), Number(longitude), 9);

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }

    const post = new Post({
      title,
      description,
      latitude,
      longitude,
      createdBy,
      h3Index,
      images: imageUrls,
    });

    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get posts near a specific location (within radius)

const getNearbyPosts = async (req, res) => {
  try {
    console.log("📍 getNearbyPosts called");
    console.log("📡 Query parameters:", req.query);

    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      console.log("❌ Missing coordinates");
      return res.status(400).json({ message: "Coordinates required" });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const searchRadius = Number(radius);

    console.log("📍 Parsed coordinates:", { lat, lng, searchRadius });

    // ✅ Use resolution 8 for good coverage (~0.9 km diameter per hex)
    const resolution = 8;
    const userHex = h3.latLngToCell(lat, lng, resolution);

    // ✅ Each hex at res 8 covers ~0.74 km circumradius
    const hexCircumradiusKm = 0.74;
    const steps = Math.ceil(searchRadius / hexCircumradiusKm);

    // ✅ Get all nearby hex indexes
    const nearbyHexes = h3.gridDisk(userHex, steps);

    console.log("🔍 H3 Details:");
    console.log("   - User Hex:", userHex);
    console.log("   - Resolution:", resolution);
    console.log("   - Steps calculated:", steps);
    console.log("   - Nearby Hexes Count:", nearbyHexes.length);

    // 🧾 Optional: Check your DB contents
    const totalPostCount = await Post.countDocuments();
    console.log("📊 Total posts in database:", totalPostCount);

    // ✅ Find posts in these hexes
    const posts = await Post.find({
      h3Index: { $in: nearbyHexes },
    })
      .sort({ createdAt: -1 })
      .limit(50); // optional limit to prevent overload

    console.log("✅ Posts found:", posts.length);

    res.status(200).json({
      posts,
      metadata: {
        radius: searchRadius,
        totalFound: posts.length,
        searchLocation: { lat, lng },
        hexesSearched: nearbyHexes.length,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching nearby posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Error fetching post" });
  }
};

const likePost = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      //filter() creates a new array that includes only the elements for which the condition is true.
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likedBy.push(userId);
    }

    post.likes = post.likedBy.length;
    await post.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likes: post.likes,
      postId: post._id,
    });
  } catch (err) {
    console.error("Error liking/unliking post:", err);
    res.status(500).json({ message: "Error liking/unliking post" });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!text.trim())
      return res.status(400).json({ message: "Comment cannot be empty" });

    post.comments.push({
      user: userName,
      text: text,
      createdAt: new Date(),
    });

    await post.save();
    res.status(200).json({
      message: "Comment added successfully",
      post,
    });
  } catch (err) {
    console.error("Error commenting:", err);
    res.status(500).json({ message: "Error adding comment" });
  }
};

const getTopPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ likes: -1 }).limit(5); //-1 means desc 1 means asc of likes count
    res.json(posts);
  } catch (err) {
    console.error("Error fetching top posts:", err);
    res.status(500).json({ message: "Error fetching top posts" });
  }
};

module.exports = {
  createPost,
  getNearbyPosts,
  getAllPosts,
  getPostById,
  likePost,
  commentOnPost,
  getTopPosts,
};
