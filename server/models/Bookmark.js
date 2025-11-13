import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  bookId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
BookmarkSchema.index({ uid: 1, bookId: 1 }, { unique: true });

export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
