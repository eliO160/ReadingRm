import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true, index: true }, // Firebase user id
  email: String,
  displayName: String,
  photoURL: String,
  favorites: [{ bookId: Number, addedAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date,
});

export default mongoose.models.User || mongoose.model("User", userSchema);
