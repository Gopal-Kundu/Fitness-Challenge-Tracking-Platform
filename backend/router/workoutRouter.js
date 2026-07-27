import express from 'express';
import {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  assignWorkoutToUser,
} from '../controller/workoutController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllWorkouts);
router.get('/:id', getWorkoutById);
router.post('/', protect, authorizeRoles('admin', 'trainer'), createWorkout);
router.post('/:id/assign', protect, assignWorkoutToUser);

export default router;
