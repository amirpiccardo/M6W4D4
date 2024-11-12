const mongoose = require("mongoose");

// Schema per i commenti
const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    ref: "Author",
    required: true,
  },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Schema per i post del blog
const BlogPostSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, default: "https://picsum.photos/300" },
    readtime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: { type: String, ref: "Author", required: true },
    content: { type: String, required: true },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", BlogPostSchema);
