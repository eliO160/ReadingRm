import express from 'express';
import { verifyFirebaseToken } from '../auth.js';
import ReadingProgress from '../models/ReadingProgress.js';

const router = express.Router();

router.use(verifyFirebaseToken);

// GET /api/progress/:bookId  -> get last progress
router.get('/:bookId', async (req, res) => {
  try {
    const userId = req.user.uid;       // from Firebase token
    const { bookId } = req.params;

    const progress = await ReadingProgress.findOne({ userId, bookId });
    if (!progress) return res.json(null);   // no progress yet

    res.json({
      scrollPercent: progress.scrollPercent,
      lastUpdated: progress.lastUpdated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching progress');
  }
});

// PUT /api/progress/:bookId 
router.put('/:bookId', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { bookId } = req.params;
    const { scrollPercent } = req.body;

    if (typeof scrollPercent !== 'number' || scrollPercent < 0 || scrollPercent > 1) {
      return res.status(400).send('Invalid scrollPercent');
    }

    const progress = await ReadingProgress.findOneAndUpdate(
      { userId, bookId },
      { scrollPercent, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('Error saving reading progress', err);
    res.status(500).send('Error saving progress');
  }
});

export default router;
