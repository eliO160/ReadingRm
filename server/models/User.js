import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true }, // Firebase uid
  email: { type: String },
  displayName: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
