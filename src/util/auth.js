import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';

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

export function isUsernameAllowed(username) {
  return (
    username.length >= 3 &&
    // metches a single white space
    !/\s/.test(username) &&
    // only alphanumeric or dot
    // the regex needs it!
    // eslint-disable-next-line no-useless-escape
    !/[^A-Za-z0-9_\.]/.test(username) &&
    // no more than one dot
    !/.*\..*\..*/.test(username)
  );
}

/*
  created this function to be able to use the same logic without duplication in both auth-controller's register route and test/util/generate to generate user and passwords for testing and avoid duplication.
*/
const saltRounds = process.env.NODE_ENV === 'test' ? 1 : 10;

export function getHashedPassword(password) {
  if (typeof password === 'undefined') throw Error('no password to hash');
  return hash(password, saltRounds);
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

export const authenticateToken = expressJWT({
  secret,
});

// covered in integration test
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
