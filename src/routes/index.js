import { Router } from 'express';
import registerRouter from './register';
import loginRouter from './login';
import { authenticateToken } from '../util/auth';

const router = Router();
router.use('/register', registerRouter);
router.use('/login', loginRouter);

// monkey-testing auth middleware
router.get('/', authenticateToken, (req, res, next) => {
  res.json({ message: 'hello, world' });
});

export default router;
