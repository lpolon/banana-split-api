import { Router } from 'express';
import * as authController from './auth-controller';

export default function getAuthRoutes() {
  const router = Router();
  router.post('/register', authController.register);
  router.post('/login', authController.login);

  return router;
}
