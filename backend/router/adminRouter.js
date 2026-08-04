import express from 'express';
import {
  getAdminDashboardStats,
  addUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateUserStatus,
  updateUserMembership,
} from '../controller/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorizeRoles('admin'), getAdminDashboardStats);
router.post('/users', protect, authorizeRoles('admin'), addUserByAdmin);
router.put('/users/:id', protect, authorizeRoles('admin'), updateUserByAdmin);
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUserByAdmin);
router.put('/users/:id/status', protect, authorizeRoles('admin'), updateUserStatus);
router.put('/users/:id/membership', protect, authorizeRoles('admin'), updateUserMembership);

export default router;
