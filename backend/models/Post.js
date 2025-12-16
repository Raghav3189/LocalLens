const mongoose = require("mongoose");
const h3 = require("h3-js");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔹 NEW: Type of post
    postType: {
      type: String,
      enum: ["complaint", "concern", "normal"],
      default: "normal",
      index: true,
    },

    // 🔹 NEW: Status of post
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
      index: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    h3Index: {
      type: String,
      index: true,
    },

    images: {
      type: [String],
      default: [],
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    likes: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", 
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

/* ------------------ PRE SAVE ------------------ */
postSchema.pre("save", function (next) {
  if (this.latitude && this.longitude) {
    this.h3Index = h3.latLngToCell(this.latitude, this.longitude, 8);
  }

  this.likes = this.likedBy.length;
  next();
});

module.exports = mongoose.model("Post", postSchema);
