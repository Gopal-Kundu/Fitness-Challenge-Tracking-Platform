import express from 'express';
import { getAdminDashboardStats } from '../controller/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorizeRoles('admin'), getAdminDashboardStats);

export default router;
