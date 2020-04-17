import { verify } from 'jsonwebtoken';

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

// authentication middleware:
export function authenticateToken(req, res, next) {
  // get the token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // TOKEN FROM BEARER TOKEN
  // is there a token?
  if (typeof token === 'undefined') return res.sendStatus(401);
  // is it valid?
  // verify does not return a promise
  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(user);
    if (err) return res.sendStatus(403); // 403 => you have a token, but it is no longer valid
    req.user = user;
    next();
  });
}
