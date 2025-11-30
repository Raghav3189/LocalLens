const mongoose = require("mongoose");
const h3 = require("h3-js");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    h3Index:{
      type: String,
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
        user: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

postSchema.pre("save", function (next) {
  if (this.latitude && this.longitude) {
    this.h3Index = h3.latLngToCell(this.latitude, this.longitude, 8);
  }
  this.likes = this.likedBy.length;
  next();
});

module.exports = mongoose.model("Post", postSchema);
