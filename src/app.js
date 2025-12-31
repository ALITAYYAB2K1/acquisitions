import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';
import { securityMiddleware } from '#middleware/security.middleware.js';
import userRoutes from '#routes/user.routes.js';
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

// Skip security middleware in test environment
if (process.env.NODE_ENV !== 'test') {
  app.use(securityMiddleware);
}
app.get('/', (req, res) => {
  logger.info('Received GET request');
  res.status(200).send('Hello from acquisitions API!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to acquisitions API!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});
export default app;
