import { verify } from 'jsonwebtoken';
import { compare } from 'bcrypt';

import LocalStrategy from 'passport-local';
import { User } from '../models/User';
export function isPasswordAllowed(password) {
  return (
    password.length > 6 &&
    // non-alphanumeric
    /\W/.test(password) &&
    // digit
    /\d/.test(password) &&
    // capital letter
    /[A-Z]/.test(password) &&
    // lowercase letter
    /[a-z]/.test(password)
  );
}

function isPasswordValid(inputtedPassword, user) {
  let hashedPassword;
  if (user === null) {
    hashedPassword = '';
  } else {
    hashedPassword = user.password;
  }
  return compare(inputtedPassword, hashedPassword);
}

// authentication middleware:
// TODO: substitute by passport-JWT or express-jwt
export function authenticateToken(req, res, next) {
  // get the token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // TOKEN FROM BEARER TOKEN
  // is there a token?
  if (typeof token === 'undefined') return res.sendStatus(401);
  // is it valid?
  // verify does not return a promise
  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // 403 => you have a token, but it is no longer valid
    req.user = user;
    next();
  });
}

// TODO: Eu testei na mão o erro quando: username não existe, quando o password está errado e quando username e password estão OK. Escrever testes.

export function getLocalStrategy() {
  return new LocalStrategy(async (username, password, done) => {
    let foundUser;
    try {
      foundUser = await User.findOne({ username });
    } catch (error) {
      return done(error);
    }
    if (foundUser === null || !(await isPasswordValid(password, foundUser)))
      return done(null, false, { message: 'username or password is invalid' });

    return done(null, foundUser);
  });
}
