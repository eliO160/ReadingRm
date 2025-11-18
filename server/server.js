import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5050;

import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => {
    console.error('Mongo connection error', err?.message || err);
    process.exit(1);
  });

import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import bookRoutes from './routes/books.js';
import bookmarkRoutes from './routes/bookmarks.js';
import { verifyFirebaseToken } from './auth.js';

import User from './models/User.js';
import Bookmark from './models/Bookmark.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Healthcheck (public)
app.get('/', (_req, res) => res.send('API is working'));

// Public books routes (your existing router)
app.use('/api/books', bookRoutes);

app.use('/api/bookmarks', bookmarkRoutes);

// -------------------- PROTECTED ROUTES --------------------
const protectedRouter = express.Router();
protectedRouter.use(verifyFirebaseToken);

// whoami + ensure user doc exists
protectedRouter.get('/me', async (req, res) => {
  const { uid, email, name, picture, auth_time } = req.user;
  const user = await User.findOneAndUpdate(
    { uid },
    {
      $setOnInsert: { uid, createdAt: auth_time ? new Date(auth_time * 1000) : new Date() },
      $set: { email: email ?? null, displayName: name ?? null, photoURL: picture ?? null, lastLoginAt: new Date() }
    },
    { new: true, upsert: true }
  );
  res.json({ uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL });
});

// Bookmarks — list
protectedRouter.get('/bookmarks', async (req, res) => {
  const items = await Bookmark.find({ uid: req.user.uid }).lean();
  res.json(items);
});

// Bookmarks — add (idempotent)
protectedRouter.post('/bookmarks', async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ error: 'bookId required' });
  const doc = await Bookmark.findOneAndUpdate(
    { uid: req.user.uid, bookId },
    { $setOnInsert: { uid: req.user.uid, bookId } },
    { new: true, upsert: true }
  );
  res.json(doc);
});

// Bookmarks — delete
protectedRouter.delete('/bookmarks/:bookId', async (req, res) => {
  await Bookmark.deleteOne({ uid: req.user.uid, bookId: req.params.bookId });
  res.json({ ok: true });
});

// Mount protected
app.use('/api', protectedRouter);
// ----------------------------------------------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
