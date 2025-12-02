import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import uploadRoute from "./routes/UploadRoute.js"; // adjust path if needed

// routes
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import UploadRoute from "./routes/UploadRoute.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// to serve images inside public folder
app.use(express.static("public"));
app.use("/images", express.static("images"));

const MONGODB_URI = process.env.MONGODB_CONNECTION
  ? process.env.MONGODB_CONNECTION.trim()
  : null;

if (!MONGODB_URI) {
  console.error("MONGODB_CONNECTION is not set in .env");
}

mongoose
  .connect(MONGODB_URI, { dbName: "sociogram", useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("Backend running!");
});
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/posts", PostRoute);
app.use("/upload", UploadRoute);

// serve files in server/public/images at /images
app.use("/images", express.static(path.join(process.cwd(), "public", "images")));

// mount upload route at /images/upload
app.use("/images", uploadRoute);
