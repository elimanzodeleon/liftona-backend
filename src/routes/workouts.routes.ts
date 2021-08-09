import { Router } from 'express';
import { addWorkout, deleteWorkout } from '../controllers/workouts.controller';

const router = Router();

router.get('/');
router.post('/', addWorkout);
router.delete('/:workoutId', deleteWorkout);

export default router;
