import express from 'express';
import getAuthRoutes from './auth';

export default function getRouter() {
  const router = express.Router();
  router.get('/', sayHello);
  router.use('/auth', getAuthRoutes());

  return router;
}

function sayHello(req, res, next) {
  return res.json({ message: 'hello, world' });
}
