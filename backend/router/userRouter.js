import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getAllUsers,
  assignTrainer,
} from '../controller/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.put('/assign-trainer', protect, authorizeRoles('admin'), assignTrainer);

export default router;
