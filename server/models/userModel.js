import mongoose from "mongoose";

//user schema definition
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true })

//user model
const User = mongoose.model('User', userSchema);
export default User;