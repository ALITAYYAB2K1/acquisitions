import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { user } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user);
  } catch (error) {
    logger.error('Error getting all users', error);
    throw error;
  }
};

export const getUserById = async id => {
  try {
    const result = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, id));
    return result[0] || null;
  } catch (error) {
    logger.error('Error getting user by id', error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const result = await db
      .update(user)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    return result[0] || null;
  } catch (error) {
    logger.error('Error updating user', error);
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    const result = await db
      .delete(user)
      .where(eq(user.id, id))
      .returning({ id: user.id });
    return result[0] || null;
  } catch (error) {
    logger.error('Error deleting user', error);
    throw error;
  }
};
