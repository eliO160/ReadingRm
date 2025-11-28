import mongoose from 'mongoose';

const UserPrefSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true, unique: true },
    prefs: {
      mode: { type: String, enum: ['light', 'dark'], default: 'light' },
      size: { type: String, default: 'md' },
      width: { type: String, default: 'normal' },
      font: { type: String, default: 'serif' },
      // add future prefs here
    },
  },
  { timestamps: true }
);

export default mongoose.model('UserPref', UserPrefSchema);
