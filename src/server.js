import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from 'errorhandler';
import { getLocalStrategy } from './util/auth';
import passport from 'passport';
import getRouter from './routes/index';

config();
// adapted from: https://github.com/kentcdodds/testing-node-apps/blob/tjs/src/start.js
export default function startServer({ port = process.env.PORT } = {}) {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(passport.initialize());
  passport.use(getLocalStrategy());
  app.use(morgan('dev'));

  app.use('/api', getRouter());

  app.use(errorHandler());
  // TODO: prod error middleware

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`server listening at ${port}...`);
      }
      const originalCloseMethod = server.close.bind(server);
      server.close = () => {
        return new Promise(resolveClose => {
          originalCloseMethod(resolveClose);
        });
      };
      resolve(server);
    });
  });
}
