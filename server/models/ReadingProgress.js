// models/ReadingProgress.js
import mongoose from 'mongoose';

const readingProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  bookId: { type: String, required: true, index: true },
  scrollPercent: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

readingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default mongoose.model('ReadingProgress', readingProgressSchema);
