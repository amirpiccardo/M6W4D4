require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authorsRouter = require("./routes/authors");
const blogPostsRouter = require("./routes/blogPosts");
const uploadRouter = require("./routes/upload");
const emailRoute = require("./routes/sendEmail");
const usersRoute = require("./routes/users");
const githubRoute = require("./routes/github");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connesso a MongoDB"))
  .catch((err) => console.error("Errore di connessione a MongoDB:", err));

app.use(express.json());
app.use(cors());
app.use("", authorsRouter);
app.use("", blogPostsRouter);
app.use("", uploadRouter);
app.use("", emailRoute);
app.use("", usersRoute);
app.use("", githubRoute);

const port = process.env.PORT || 4040;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
