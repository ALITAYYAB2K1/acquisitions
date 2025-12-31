import logger from '#config/logger.js';
import { formatValidationErrors } from '#utils/format.js';
import { updateUserSchema } from '#validations/user.validation.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/user.service.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Received GET request');
    const users = await getAllUsers();
    res.json({
      status: 'successfully fetched all users',
      data: users,
      count: users.length,
    });
  } catch (error) {
    logger.error('Error getting all users', error);
    next(error);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Received GET request for user ${id}`);
    const userData = await getUserById(Number(id));
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      status: 'successfully fetched user',
      data: userData,
    });
  } catch (error) {
    logger.error('Error getting user by id', error);
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUserId = Number(id);

    // Validation
    const validationResult = updateUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const updateData = validationResult.data;

    // Users can only update their own profile, admins can update any
    if (req.user.role !== 'admin' && req.user.id !== targetUserId) {
      return res
        .status(403)
        .json({ error: 'You can only update your own profile' });
    }

    // Only admins can change roles
    if (updateData.role && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Only admins can change user roles' });
    }

    logger.info(`Received PUT request for user ${id}`);
    const userData = await updateUser(targetUserId, updateData);
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      status: 'successfully updated user',
      data: userData,
    });
  } catch (error) {
    logger.error('Error updating user', error);
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUserId = Number(id);

    // Admins cannot delete themselves
    if (req.user.id === targetUserId) {
      return res
        .status(403)
        .json({ error: 'You cannot delete your own account' });
    }

    logger.info(`Received DELETE request for user ${id}`);
    const result = await deleteUser(targetUserId);
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      status: 'successfully deleted user',
      data: result,
    });
  } catch (error) {
    logger.error('Error deleting user', error);
    next(error);
  }
};
