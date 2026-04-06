import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  socketId: string;
  username: string;
  position: { x: number; y: number };
  lastActive: Date;
}

const UserSchema = new Schema<IUser>({
  socketId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  lastActive: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
