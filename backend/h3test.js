const mongoose = require("mongoose");
const Post = require("./models/Post.js");

mongoose.connect("mongodb://127.0.0.1:27017/locallens")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

const test = async () => {
  const post = new Post({
    title: "Broken street light",
    description: "The street light near park is not working",
    createdBy: "671b3f0e9d5e0e92f8a23456", // example user id
    latitude: 12.9716,
    longitude: 77.5946,
  });

  await post.save();
  console.log("Post saved with H3 Index:", post.h3Index);

  mongoose.connection.close();
};

test();
