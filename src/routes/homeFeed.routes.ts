import { Router } from 'express';
import { getHomeFeed } from '../controllers/homeFeed.controller';

const router = Router();

router.get('/', getHomeFeed);

export default router;
