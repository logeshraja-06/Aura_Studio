import express from 'express';
import { loginAdmin, registerStaff, getMe } from '../controllers/authController.js';
import { protectAdmin, requireAdminRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', protectAdmin, requireAdminRole, registerStaff);
router.get('/me', protectAdmin, getMe);

export default router;
