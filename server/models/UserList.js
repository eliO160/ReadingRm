import mongoose from 'mongoose';
const ListItemSchema = new mongoose.Schema(
  { bookId: { type: String, required: true }, addedAt: { type: Date, default: Date.now } },
  { _id: false }
);

const UserListSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    items: { type: [ListItemSchema], default: [] },
  },
  { timestamps: true }
);

// One list name per user
UserListSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('UserList', UserListSchema);
