import express from 'express';
import {
  getTrainerMembers,
  createWorkoutPlan,
  createDietPlan,
  addTrainerFeedback,
  markMemberWorkoutComplete,
} from '../controller/trainerController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/members', protect, authorizeRoles('trainer', 'admin'), getTrainerMembers);
router.post('/workout-plan', protect, authorizeRoles('trainer', 'admin'), createWorkoutPlan);
router.post('/diet-plan', protect, authorizeRoles('trainer', 'admin'), createDietPlan);
router.post('/feedback', protect, authorizeRoles('trainer', 'admin'), addTrainerFeedback);
router.post('/complete-workout', protect, authorizeRoles('trainer', 'admin'), markMemberWorkoutComplete);

export default router;
