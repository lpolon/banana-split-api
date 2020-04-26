import { User } from '../models/User';
import { isPasswordAllowed } from '../util/auth';
import { hash } from 'bcrypt';
import passport from 'passport';
import { sign } from 'jsonwebtoken';

export async function register(req, res, next) {
  const { username, password } = req.body;
  if (!username)
    return res.status(400).json({ message: `username can't be blank` });
  if (!password)
    return res.status(400).json({ message: `password can't be blank` });

  if (!isPasswordAllowed(password))
    return res.status(400).json({ message: `password is not strong enough` });
  try {
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    // TODO: Send JWT here.

    // TODO: test throws
  } catch (error) {
    const {
      username: { message },
    } = error.errors;
    if (typeof username === 'undefined') return res.sendStatus(500);
    res.status(400).json({ error: message });
    return next(error);
  }
}

function authenticatePassportLocalStrategyMiddleware(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        reject(err);
      } else {
        resolve({ user, info });
      }
    })(req, res, next);
  });
}

export async function login(req, res, next) {
  const { username = '', password: inputtedPassword = '' } = req.body;
  if (!username)
    return res.status(400).json({ message: "username can't be blank" });
  if (!inputtedPassword)
    return res.status(400).json({ message: "password can't be blank" });

  const { user, info } = await authenticatePassportLocalStrategyMiddleware(
    req,
    res,
    next,
  );
  if (!user) return res.status(400).json(info);

  const claims = { id: user._id, username: user.username };
  const userToken = sign(claims, process.env.ACCESS_TOKEN_SECRET);
  // TODO: remove unnecessary keys from token bofore sending back. Like 'iat'.
  return res.json({
    token: userToken,
    user: { id: user._id, username: user.username },
  });
}

export function me(req, res, next) {
  if (!req.user) return res.sendStatus(404);
  res.json({ user: req.user });
}
