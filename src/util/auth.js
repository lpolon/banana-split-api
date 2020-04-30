import { verify, sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

import LocalStrategy from 'passport-local';
import expressJWT from 'express-jwt';
import { User } from '../models/User';

const secret = String(process.env.ACCESS_TOKEN_SECRET);
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

function selectKeysFromUser(inputtedUser = undefined, keysArray) {
  let user;
  if (typeof inputtedUser === 'undefined') throw Error('No user found');
  if (Object.prototype.hasOwnProperty.call(inputtedUser, '_doc'))
    user = inputtedUser._doc;
  else user = inputtedUser;
  return Object.fromEntries(
    Object.entries(user).filter(([key, _]) => keysArray.includes(key)),
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
  return sign(claims, secret);
}

export const authenticateTokenMiddleware = expressJWT({
  secret,
});

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
