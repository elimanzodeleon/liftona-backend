import mongoose from 'mongoose';
import { REFRESH_TOKEN_EXPIRE } from '../utils/constants';

const { ObjectId } = mongoose.Schema.Types;

const RefreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// index for refreshToken, automatically removed after 1 year without update
RefreshTokenSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: REFRESH_TOKEN_EXPIRE }
);

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
