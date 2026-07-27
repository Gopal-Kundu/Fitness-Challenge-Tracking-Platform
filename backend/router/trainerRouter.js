import express from 'express';
import { getTrainerMembers, createWorkoutPlan } from '../controller/trainerController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/members', protect, authorizeRoles('trainer', 'admin'), getTrainerMembers);
router.post('/workout-plan', protect, authorizeRoles('trainer', 'admin'), createWorkoutPlan);

export default router;
