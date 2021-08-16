import mongoose from 'mongoose';
import { RESET_PASSWORD_TOKEN_EXPIRE } from '../utils/constants';

const { ObjectId } = mongoose.Schema.Types;

const ResetPasswordTokenSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

ResetPasswordTokenSchema.index(
  { updatedAt: 1 },
  { expires: RESET_PASSWORD_TOKEN_EXPIRE }
);

const ResetPasswordToken = mongoose.model(
  'ResetPasswordToken',
  ResetPasswordTokenSchema
);

export default ResetPasswordToken;
