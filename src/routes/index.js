import {Router} from 'express'
import registerRouter from './register'
const router = Router();
router.use('/register', registerRouter)

router.get('/', (req, res, next) => {
  res.json({message: 'hello, world'})
})

export default router
