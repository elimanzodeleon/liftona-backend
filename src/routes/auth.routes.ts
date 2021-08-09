import { Router } from 'express';
import {
  loginUser,
  signUpUser,
  getRefreshToken,
  forgotPassword,
  resetPassword,
  logOutUser,
} from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginUser);
router.post('/signup', signUpUser);
router.post('/refresh-token', getRefreshToken);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password', resetPassword);
router.delete('/logout', logOutUser);

export default router;
