const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const marketplaceController = require("../controllers/marketController");

// Marketplace listing
router.get("/marketplace", marketplaceController.getProducts);

// CRUD
router.post("/", protect, marketplaceController.createProduct);
router.get("/my", protect, marketplaceController.getMyProducts);
router.put("/:id", protect, marketplaceController.updateProduct);
router.delete("/:id", protect, marketplaceController.deleteProduct);

module.exports = router;
