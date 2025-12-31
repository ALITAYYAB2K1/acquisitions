import express from 'express';
const router = express.Router();
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/user.controller.js';
import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';

// GET /users - List all users (admin only)
router.get('/', authenticateToken, requireRole('admin'), fetchAllUsers);

// GET /users/:id - Get user by ID (authenticated users)
router.get('/:id', authenticateToken, fetchUserById);

// PUT /users/:id - Update user (users can update own, admin can update any)
router.put('/:id', authenticateToken, updateUserById);

// DELETE /users/:id - Delete user (admin only, cannot delete self)
router.delete('/:id', authenticateToken, requireRole('admin'), deleteUserById);

export default router;
