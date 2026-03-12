import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: String,
  bio: String,
  avatarUrl: String,
  birthDate: Date,
}, { timestamps: true });

export const Profile = mongoose.model('Profile', profileSchema);
