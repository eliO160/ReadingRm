import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";

const r = express.Router();

// GET /api/profile (protected): verify token, upsert user, return profile
r.get("/api/profile", requireAuth, async (req, res) => {
  const { uid, email, name, picture } = req.user;

  const user = await User.findOneAndUpdate(
    { uid },
    {
      $setOnInsert: {
        uid,
        email: email ?? null,
        displayName: name ?? null,
        photoURL: picture ?? null,
        createdAt: new Date(),
      },
      $set: { lastLoginAt: new Date() },
    },
    { new: true, upsert: true }
  );

  res.json({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    lastLoginAt: user.lastLoginAt,
  });
});

export default r;
