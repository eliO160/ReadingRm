import Bookmark from '../models/Bookmark.js';

export async function listBookmarks(req, res) {
  const uid = req.user.uid;
  const items = await Bookmark.find({ uid }).sort({ createdAt: -1 }).lean();
  res.json(items.map(b => ({ bookId: b.bookId, createdAt: b.createdAt })));
}

export async function isBookBookmarked(req, res) {
  const uid = req.user.uid;
  const { bookId } = req.params;
  const exists = await Bookmark.exists({ uid, bookId: String(bookId) });
  res.json({ bookmarked: !!exists });
}

export async function addBookmark(req, res) {
  const uid = req.user.uid;
  const { bookId } = req.body || {};
  if (!bookId) return res.status(400).json({ error: 'bookId required' });

  try {
    await Bookmark.updateOne(
      { uid, bookId: String(bookId) },
      { $setOnInsert: { uid, bookId: String(bookId) } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to add bookmark' });
  }
}

export async function removeBookmark(req, res) {
  const uid = req.user.uid;
  const { bookId } = req.params;
  await Bookmark.deleteOne({ uid, bookId: String(bookId) });
  res.json({ ok: true });
}
