import express from 'express';
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  joinChallenge,
  updateChallenge,
  deleteChallenge,
} from '../controller/challengeController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllChallenges);
router.get('/:id', getChallengeById);
router.post('/', protect, authorizeRoles('admin', 'trainer'), createChallenge);
router.post('/:id/join', protect, joinChallenge);
router.put('/:id', protect, authorizeRoles('admin', 'trainer'), updateChallenge);
router.delete('/:id', protect, authorizeRoles('admin', 'trainer'), deleteChallenge);

export default router;
