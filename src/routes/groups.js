import { Router } from 'express';
import { authenticateToken } from '../util/auth';
import * as groupController from './group-controller';
export default function getGroupRoutes() {
  const router = Router();
  router.get('/', authenticateToken, groupController.getGroups);
  router.post('/', authenticateToken, groupController.createGroup);
  router.delete(
    '/:groupId',
    groupController.setGroup,
    groupController.deleteGroup,
  );
  router.put(
    '/:groupId',
    groupController.setGroup,
    groupController.updateGroup,
  );
  return router;
}
