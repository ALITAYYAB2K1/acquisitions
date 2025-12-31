import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
import { user } from '#models/user.model.js';
export const hashPassword = async password => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    logger.error('Error in hashPassword service', error);
    throw new Error('Failed to hash password');
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const exisitingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (exisitingUser.length > 0) {
      throw new Error('User with this email is already exist');
    }
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(user)
      .values({ name, email, password: hashedPassword, role })
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    logger.info('User created successfully', newUser);
    return newUser;
  } catch (error) {
    logger.error('Error in createUser service', error);
    throw error;
  }
};
