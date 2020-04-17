import { Router } from 'express';
import { User } from '../models/User';
import { compare } from 'bcrypt';

import { sign } from 'jsonwebtoken';

const router = Router();

router.post('/', async (req, res, next) => {
  const { username, password: inputtedPassword } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser)
      return res.status(401).json({ message: 'wrong credentials' });

    // authenticate user
    const { password: savedHashedPassword } = foundUser;
    const isValidPw = await compare(inputtedPassword, savedHashedPassword);
    if (!isValidPw)
      return res.status(401).json({ message: 'wrong credentials' });

    // if authenticated, send jwt that can be used for authorization
    const claims = { sub: foundUser._id };
    const accessToken = sign(claims, process.env.ACCESS_TOKEN_SECRET);
    return res.json({ accessToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
