import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5051;

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
import progressRouter from './routes/progress.js';
import prefsRouter from './routes/prefs.js';
import listsRouter from './routes/lists.js';
import { verifyFirebaseToken } from './auth.js';

import User from './models/User.js';
const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Healthcheck (public)
app.get('/', (_req, res) => res.send('API is working'));

// Public routes 
app.use('/api/books', bookRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/prefs', prefsRouter);
app.use('/api/lists', listsRouter);
app.use('/api/progress', progressRouter);


// Protected routes
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

// Mount protected
app.use('/api', protectedRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
