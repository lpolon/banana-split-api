import { Router } from 'express';
import { authenticateToken } from '../util/auth';
import * as groupController from './group-controller';
export default function getGroupRoutes() {
  const router = Router();
  router.get('/', authenticateToken, groupController.getGroups);
  router.post('/', authenticateToken, groupController.createGroup);
  // TODO: test how to use router.params middleware here
  // TODO: Test this controller
  return router;
}
