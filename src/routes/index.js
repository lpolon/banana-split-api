import express from 'express';
import getAuthRoutes from './auth';
import getGroupRoutes from './groups';

export default function getRouter() {
  const router = express.Router();
  router.use('/auth', getAuthRoutes());
  router.use('/groups', getGroupRoutes());

  return router;
}
