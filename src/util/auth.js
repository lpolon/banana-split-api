import { verify, sign } from 'jsonwebtoken';
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

function selectKeysFromUser({ _doc: user } = undefined, keysArray) {
  if (typeof user === 'undefined') throw Error('No user found');
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => keysArray.includes(key)),
  );
}

export function userToJSON(user) {
  return selectKeysFromUser(user, ['username', '_id']);
}

export function getUserToken({ _id, username }) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const sixtyDaysInSeconds = 60 * 60 * 24 * 60;
  const claims = {
    _id,
    username,
    iat: issuedAt,
    exp: issuedAt + sixtyDaysInSeconds,
  };
  return sign(claims, process.env.ACCESS_TOKEN_SECRET);
}

// authentication middleware:
// TODO: substitute by passport-JWT or express-jwt
export function authenticateTokenMiddleware(req, res, next) {
  // get the token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // TOKEN FROM BEARER TOKEN
  // is there a token?
  if (typeof token === 'undefined') return res.sendStatus(401);
  // is it valid?
  // verify does not return a promise
  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      next(err);
      return res.sendStatus(403);
    } // 403 => you have a token, but it is no longer valid
    console.log(
      'as informações que eu codifiquei no token precisam estar aqui ou nada faz sentido:',
      user,
    );
    req.user = user;
    next();
  });
}

/*
TODO: Write tests to when username is undefined, when password is wrong, when username and password is ok to make sure it is throwing correctly
*/
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
