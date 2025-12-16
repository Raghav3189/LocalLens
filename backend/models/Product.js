const mongoose = require("mongoose");
const h3 = require("h3-js");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    priceUnit: {
      type: String,
      enum: ["fixed", "per_day"],
      required: true,
    },

    type: {
      type: String,
      enum: ["sell", "rent"],
      required: true,
      index: true,
    },

    images: {
      type: [String],
      default: [],
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },

    h3Index: {
      type: String,
      index: true,
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    contactPhone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.latitude && this.longitude) {
    this.h3Index = h3.latLngToCell(
      this.latitude,
      this.longitude,
      8 // resolution
    );
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
