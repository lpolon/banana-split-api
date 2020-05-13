// took from https://github.com/kentcdodds/testing-node-apps/blob/master/src/utils/error-middleware.js

import { UnauthorizedError } from 'express-jwt';
import { Error } from 'mongoose';

export function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error);
  } else if (error instanceof UnauthorizedError) {
    res.status(401);
    res.json({ code: error.code, message: error.message });
  } else if (error instanceof Error.ValidationError) {
    res.status(400);
    // TODO: make sure that path as source of error is avaliable
    res.json({ message: error.message });
  } else {
    res.status(500);
    res.json({
      message: error.message,
      // we only add a `stack` property in non-production environments
      ...(process.env.NODE_ENV === 'production'
        ? null
        : { stack: error.stack }),
    });
  }
}
