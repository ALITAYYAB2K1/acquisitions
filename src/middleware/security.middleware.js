import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

export const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    let limit, message;
    switch (role) {
      case 'guest':
        limit = 5;
        message = 'Guest limit exceeded(5 per minute)';
        break;
      case 'user':
        limit = 10;
        message = 'User limit exceeded(10 per minute)';
        break;
      case 'admin':
        limit = 20;
        message = 'Admin limit exceeded(20 per minute)';
        break;
    }
    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}_limit`,
      })
    );
    const decision = await client.protect(req);
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot detected', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        path: req.path,
      });
      return res.status(403).json({
        error: 'Bot detected',
        message: 'You are a bot',
      });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        path: req.path,
      });
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests',
      });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield blocked request', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        path: req.path,
      });
      return res.status(403).json({
        error: 'Shield blocked request',
        message: 'You are a bot',
      });
    }
    next();
  } catch (error) {
    console.error('arcjet middleware error', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'something went wrong with security middleware',
    });
  }
};
