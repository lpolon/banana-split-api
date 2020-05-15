import { User } from '../models/User';
import {
  userToJSON,
  getUserToken,
  getHashedPassword,
  isPasswordAllowed,
} from '../util/auth';
import passport from 'passport';

function sendAuthenticatedUser(user) {
  return {
    ...userToJSON(user),
    token: getUserToken(user),
  };
}

export async function register(req, res, next) {
  const { username, password } = req.body;
  if (!username)
    return res.status(400).json({ message: `username can't be blank` });
  if (!password)
    return res.status(400).json({ message: `password can't be blank` });

  if (!isPasswordAllowed(password))
    return res.status(400).json({
      message: `password is not strong enough`,
    });
  try {
    const hashedPassword = await getHashedPassword(password);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json({ user: sendAuthenticatedUser(savedUser) });
  } catch (error) {
    next(error);
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
  return res.json({ user: sendAuthenticatedUser(user) });
}

export function me(req, res, next) {
  if (!req.user) return res.sendStatus(404);
  res.json({ user: sendAuthenticatedUser(req.user) });
}
