import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwttoken.verify(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Error in authenticateToken middleware', error);
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: 'Access denied. Not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};
