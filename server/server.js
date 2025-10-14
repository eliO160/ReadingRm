import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());



// Public health check
const { default: healthRoutes } = await import("./routes/health.js");
app.use(healthRoutes);
app.get("/", (_req, res) => res.send("API is working"));

async function start() {
  try {
    // 1) Connect Mongo once
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[MongoDB] connected");

    // 2) Mount routes (protected + any others)
    const { default: profileRoutes } = await import("./routes/profile.js");
    app.use(profileRoutes);

    // If your /api/books is public and doesn't need Mongo, you can import above.
    // If it uses Mongo, import here after connect:
    // const { default: bookRoutes } = await import("./routes/books.js");
    // app.use("/api/books", bookRoutes);

    const PORT = process.env.PORT || 5051;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup error:", err.message);
    process.exit(1);
  }
}
start();
