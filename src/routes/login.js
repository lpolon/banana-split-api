import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import passport from 'passport';

const router = Router();

router.post('/', async (req, res, next) => {
  const { username = '', password: inputtedPassword = '' } = req.body;
  if (!username)
    return res.status(400).json({ message: "username can't be blank" });
  if (!inputtedPassword)
    return res.status(400).json({ message: "password can't be blank" });

  try {
    const { user, info } = await authenticatePassportLocalStrategyMiddleware(
      req,
      res,
      next,
    );
    console.log('user:', user, 'info: ', info);
    if (!user) return res.status(400).json(info);

    const claims = { sub: user._id };
    const accessToken = sign(claims, process.env.ACCESS_TOKEN_SECRET);
    // TODO: What else to pass to connect with client?
    return res.json({ accessToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

function authenticatePassportLocalStrategyMiddleware(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return reject(err);
      return resolve({ user, info });
    })(req, res, next);
  });
}

export default router;
