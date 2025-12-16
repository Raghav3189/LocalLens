const Product = require("../models/Product");
const h3 = require("h3-js");

const H3_RESOLUTION = 8;
const MAX_RESULTS = 50;

// Radius (km) → H3 k-ring mapping (resolution 8)
const radiusToK = {
  1: 2,
  3: 5,
  5: 8,
  10: 15,
  20: 30,
  30: 45,
  40: 60,
  50: 75,
};

// Haversine distance (km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ---------------- MARKETPLACE LISTING ---------------- */
exports.getProducts = async (req, res) => {
  try {
    const { lat, lng, radius = "all", type = "all" } = req.query;

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({ error: "Invalid latitude or longitude" });
    }

    const isAll = radius === "all";
    const radiusKm = isAll ? null : Number(radius);

    if (!isAll && (!radiusToK[radiusKm] || radiusKm <= 0)) {
      return res.status(400).json({ error: "Invalid radius value" });
    }

    const centerCell = h3.latLngToCell(latitude, longitude, H3_RESOLUTION);
    const k = isAll ? 75 : radiusToK[radiusKm];
    const h3Cells = h3.gridDisk(centerCell, k);

    if (h3Cells.length > 10000) {
      return res.status(400).json({ error: "Search radius too large" });
    }

    const query = { h3Index: { $in: h3Cells } };
    if (type !== "all") query.type = type;

    let products = await Product.find(query).limit(MAX_RESULTS).lean();

    products = products
      .map((p) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          p.latitude,
          p.longitude
        );

        return {
          ...p,
          distance: Math.round(distance * 10) / 10,
        };
      })
      .filter((p) => (isAll ? true : p.distance <= radiusKm))
      .sort((a, b) => a.distance - b.distance);

    res.json({ products });
  } catch (err) {
    console.error("Marketplace error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ---------------- CREATE PRODUCT ---------------- */
exports.createProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.user);
    console.log("ji");
  try {
    const {
      name,
      description,
      price,
      priceUnit,
      type,
      images,
      latitude,
      longitude,
      contactEmail,
      contactPhone,
    } = req.body;

    const parsedPrice = Math.round(Number(price)); // 🔴 no paise
    const parsedLat = Number(latitude);
    const parsedLng = Number(longitude);

    if (
      !name?.trim() ||
      !description?.trim() ||
      Number.isNaN(parsedPrice) ||
      Number.isNaN(parsedLat) ||
      Number.isNaN(parsedLng) ||
      !priceUnit ||
      !type ||
      !contactEmail?.trim() ||
      !contactPhone?.trim()
    ) {
      return res.status(400).json({ error: "Invalid or missing fields" });
    }

    const cleanImages = Array.isArray(images)
      ? images.map((url) => url.trim())
      : [];

    const product = new Product({
      user: req.user.id, // 🔴 REQUIRED for profile & delete
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      priceUnit,
      type,
      images: cleanImages,
      latitude: parsedLat,
      longitude: parsedLng,
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

/* ---------------- GET MY PRODUCTS ---------------- */
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/* ---------------- DELETE PRODUCT ---------------- */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ownership check
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const fields = [
      "name",
      "description",
      "price",
      "priceUnit",
      "type",
      "contactEmail",
      "contactPhone",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};
