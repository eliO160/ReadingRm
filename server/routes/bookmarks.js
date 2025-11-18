import express from 'express';
import { verifyFirebaseToken } from '../auth.js';
import {
  listBookmarks,
  isBookBookmarked,
  addBookmark,
  removeBookmark,
} from '../controllers/bookmarksController.js';

const router = express.Router();

// All bookmark routes require a valid Firebase ID token
router.use(verifyFirebaseToken);

// GET /api/bookmarks -> [{ bookId, createdAt }]
router.get('/', listBookmarks);

// GET /api/bookmarks/:bookId -> { bookmarked: true|false }
router.get('/:bookId', isBookBookmarked);

// POST /api/bookmarks  { bookId } -> { ok: true }
router.post('/', addBookmark);

// DELETE /api/bookmarks/:bookId -> { ok: true }
router.delete('/:bookId', removeBookmark);

export default router;
