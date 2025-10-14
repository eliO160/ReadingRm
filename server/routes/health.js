import express from "express";
import mongoose from "mongoose";
import { adminAuth } from "../firebaseAdmin.js";

const r = express.Router();

r.get("/api/_health", async (_req, res) => {
  const mongoState = ["disconnected","connected","connecting","disconnecting"][mongoose.connection.readyState] || "unknown";
  let fbAdminOK = true;
  try { await adminAuth(); } catch { fbAdminOK = false; }
  res.json({
    ok: mongoState === "connected" && fbAdminOK,
    mongo: mongoState,
    firebaseAdmin: fbAdminOK,
    port: process.env.PORT,
  });
});

export default r;
