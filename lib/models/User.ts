import mongoose, { Schema } from 'mongoose';
import { IUser } from '@/types';

const UserSchema = new Schema<IUser>(
  {
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during development
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
