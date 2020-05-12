import mongoose from 'mongoose';
import axios from 'axios';
import { startServer } from '../start';
import { handleRequestFailure, getData, resolve } from '../../test/util/async';
import * as generate from '../../test/util/generate';
const MONGODB_URI_DB = 'mongodb://localhost/banana_TEST_AUTH';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let server;
let api;

beforeAll(async done => {
  server = await startServer();
  const baseURL = `http://localhost:${server.address().port}/api`;
  api = axios.create({ baseURL });
  api.interceptors.response.use(getData, handleRequestFailure);
  await mongoose.connect(MONGODB_URI_DB, options);
  done();
});
afterAll(async done => {
  await mongoose.connection.close();
  await server.close();
  done();
});

beforeEach(() => mongoose.connection.dropDatabase());

test('The auth flow happy path works', async () => {
  const authForm = generate.loginForm();
  const registerData = await api.post(`auth/register`, authForm);

  expect(registerData.user).toEqual({
    /*
    .any() asymetrical matches. assertions about types in general.
    */
    token: expect.any(String),
    _id: expect.any(String),
    username: authForm.username,
  });

  const loginData = await api.post(`auth/login`, authForm);

  expect(loginData.user).toEqual(registerData.user);

  const meData = await api.get(`auth/me`, {
    headers: {
      Authorization: `Bearer ${loginData.user.token}`,
    },
  });

  expect(meData.user).toEqual(loginData.user);
});

test('GET api/auth/me unauthenticated returns error', async done => {
  const error = await api.get(`auth/me`).catch(resolve);
  expect(error).toMatchInlineSnapshot(
    `[Error: 401: {"code":"credentials_required","message":"No authorization token was found"}]`,
  );
  done();
});

test('GET /api/groups unauthenticated returns error for groups protected routes', async done => {
  const error = await api.get(`groups`).catch(resolve);
  expect(error).toMatchInlineSnapshot(
    `[Error: 401: {"code":"credentials_required","message":"No authorization token was found"}]`,
  );
  done();
});
