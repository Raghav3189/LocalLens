require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postRoutes");
const marketplaceRoutes = require("./routes/marketplace");
const userRoutes = require("./routes/userRoutes");


// Validate env
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI not set");
  process.exit(1);
}

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/products", marketplaceRoutes);
app.use("/api/cloudinary", require("./routes/cloudinary"));

// Health check (standard)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
