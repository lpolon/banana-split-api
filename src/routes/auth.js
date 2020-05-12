import { Router } from 'express';
import { authenticateToken } from '../util/auth';
import * as authController from './auth-controller';

export default function getAuthRoutes() {
  const router = Router();
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/me', authenticateToken, authController.me);
  return router;
}
