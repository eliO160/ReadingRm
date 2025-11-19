import express from 'express';
import { verifyFirebaseToken } from '../auth.js';
import User from '../models/User.js';

const router = express.Router();
router.use(verifyFirebaseToken);

// Upsert the user and return profile
router.get('/', async (req, res) => {
  const { uid, email, name, picture } = req.user || {};
  if (!uid) return res.status(400).json({ error: 'No uid on token' });

  // Create or update the user doc
  const doc = await User.findOneAndUpdate(
    { uid },
    {
      $setOnInsert: { uid, createdAt: new Date() },
      $set: {
        email: email || null,
        displayName: name || null,
        lastLoginAt: new Date(),
      },
    },
    { new: true, upsert: true }
  ).lean();

  res.json({
    uid: doc.uid,
    email: doc.email,
    displayName: doc.displayName,
    createdAt: doc.createdAt,
    lastLoginAt: doc.lastLoginAt,
  });
});

export default router;
