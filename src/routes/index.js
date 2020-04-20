import { Router } from 'express';
import authRouter from './auth';

const router = Router();
router.use('/auth', authRouter);

router.get('/', (req, res, next) => {
  res.json({ message: 'hello, world' });
});

export default router;
