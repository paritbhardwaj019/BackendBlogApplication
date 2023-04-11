const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoute");
const postRoutes = require("./routes/postRoute");
const commentRoutes = require("./routes/commentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/category", categoryRoutes);

// Unmatched Routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "404 Resource Not Found!",
  });
});

module.exports = app;
