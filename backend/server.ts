import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import apiRouter from "./server/routes/index.ts";

import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors({
  origin: [
  "http://localhost:5173",
  "https://hired-project-beta.vercel.app"
],
  credentials: true
}));

// uploads folder
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

console.log("LOGIN HIT");

async function startServer() {
  try {
    // MongoDB connection
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");

    // health check
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });
const PORT = Number(process.env.PORT) || 3000;
    // API routes
    app.use("/api", apiRouter);

  

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Server error:", err);
  }
}

startServer();