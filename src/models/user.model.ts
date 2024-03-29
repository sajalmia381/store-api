import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  number?: string | number;
  role: string;
  updatedAt: Date;
  createdAt: Date;
  lastLoginAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>
  updateLogin(): void
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: Number },
  lastLoginAt: { type: Date },
  role: { type: String, default: 'ROLE_CUSTOMER' }
}, { timestamps: true})

UserSchema.pre("save", async function (next: mongoose.HookNextFunction) {
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false) 
}
UserSchema.methods.updateLogin = async function () {
  const user = this as UserDocument;
  user.lastLoginAt = new Date();
  user.save()
}
export default model<UserDocument>('User', UserSchema);
