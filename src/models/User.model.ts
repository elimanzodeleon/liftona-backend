import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { IUser, IUserModel } from '../interfaces/users.interface';

const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      minLength: 1,
      maxLength: 15,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    workouts: { type: [{ type: ObjectId, ref: 'Workout' }], default: [] },
    likes: { type: [{ type: ObjectId, ref: 'Workout' }], default: [] },
    followers: { type: [{ type: ObjectId, ref: 'User' }], default: [] },
    following: { type: [{ type: ObjectId, ref: 'User' }], default: [] },
  },
  { timestamps: true }
);

UserSchema.statics.login = async (username: string, password: string) => {
  const user = await User.findOne({ username }).select('+password');
  if (!user)
    throw new createError.Unauthorized(
      'The username and password provided did not match our records.'
    );

  // compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    throw new createError.Unauthorized(
      'The username and password provided did not match our records.'
    );

  return user;
};

// password hashing method
UserSchema.pre('save', function (next) {
  // if password was not modified, skip this
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 12, (error, result) => {
    if (error)
      throw new createError.InternalServerError('Internal Server Error.');

    // set users password to the hashed version
    this.password = result;
    next();
  });
});

const User = mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
