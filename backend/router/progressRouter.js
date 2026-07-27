import express from 'express';
import {
  createProgress,
  addPointsToUser,
  getChallengeProgress,
} from '../controller/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createProgress);
router.put('/:id/points', protect, addPointsToUser);
router.get('/:challengeId', getChallengeProgress);

export default router;
