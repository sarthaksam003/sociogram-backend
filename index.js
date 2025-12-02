import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// routes
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import uploadRoute from "./routes/UploadRoute.js"; // single import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// serve static files (general) and images specifically
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/images", express.static(path.join(process.cwd(), "public", "images")));

// DB connect
const MONGODB_URI = process.env.MONGODB_CONNECTION ? process.env.MONGODB_CONNECTION.trim() : null;
if (!MONGODB_URI) {
  console.error("MONGODB_CONNECTION is not set in environment");
}

mongoose
  .connect(MONGODB_URI, { dbName: "sociogram", useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.error("MongoDB connection error:", error));

// basic route
app.get("/", (req, res) => res.send("Backend running!"));

// API routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/posts", PostRoute);

// - POST /images/  (router handles post "/")
// - POST /upload   (alias for older clients)
app.use("/images", uploadRoute); 
app.use("/upload", uploadRoute); 

export default app;
