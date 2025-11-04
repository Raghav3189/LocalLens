//tells backend how to handle image uploads from users
//Multer a middleware for handling multipart/form-data, which is used for uploading files (like images).
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary, //tells Multer to use my Cloudinary account.
  params: {
    folder: "local_lens_posts",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

//Initializes Multer using that Cloudinary storage engine
const upload = multer({ storage });

module.exports = upload;
