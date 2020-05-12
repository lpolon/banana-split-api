import { Router } from 'express';
import { authenticateToken } from '../util/auth';
import * as groupController from './group-controller';
export default function getGroupRoutes() {
  const router = Router();
  router.get('/', authenticateToken, groupController.getGroups);
  return router;
}
