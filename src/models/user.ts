import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);
