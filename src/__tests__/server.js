import * as index from '../start';
import mongoose from 'mongoose';
import { application as app } from 'express';

let server;

afterAll(async done => {
  await mongoose.connection.close();
  await server.close();
  done();
});

test('the entry point calls express().listen() and mongoose.connect() sucessfully', async done => {
  jest.spyOn(mongoose, 'connect');
  jest.spyOn(app, 'listen');
  server = await index.startServer();
  index.startDb();
  expect(mongoose.connect).toHaveBeenCalledTimes(1);
  expect(app.listen).toHaveBeenCalledTimes(1);

  await mongoose.connect.mockRestore();
  await app.listen.mockRestore();
  done();
});
