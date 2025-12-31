import logger from '#config/logger.js';
import { formatValidationErrors } from '#utils/format.js';
import { signupSchema } from '#validations/auth.validation.js';
import { createUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }
    const { name, email, role, password } = validationResult.data;
    // auth service

    const newUser = await createUser({ name, email, password, role });
    const token = jwttoken.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    cookies.set(res, 'token', token);
    logger.info('User created successfully', { name, email, password });
    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Error in signup controller', error);
    if (error.message === 'User with this email is already exist') {
      return res.status(409).json({ error: 'email already exist' });
    }
    next(error);
  }
};
