import mongoose from 'mongoose';
import axios from 'axios';
import startServer from '../server';
import { handleRequestFailure, getData } from '../../test/util/async';
const MONGODB_URI_DB = 'mongodb://localhost/banana_TEST_AUTH';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let server;
const port = 5001;
beforeAll(async done => {
  server = await startServer({ port: 5001 });
  await mongoose.connect(MONGODB_URI_DB, options);
  done();
});
afterAll(async done => {
  await mongoose.connection.close();
  await server.close();
  done();
});

beforeEach(() => mongoose.connection.dropDatabase());

const baseURL = `http://localhost:${port}/api/auth`;

const api = axios.create({ baseURL });
api.interceptors.response.use(getData, handleRequestFailure);

test('auth flow', async () => {
  const authForm = { username: 'abcd', password: 'Abc123!' };
  const registerData = await api.post(`register`, authForm);

  expect(registerData.user).toEqual({
    /*
    .any() asymetrical matches. assertions about types in general.
    */
    token: expect.any(String),
    _id: expect.any(String),
    username: authForm.username,
  });

  const loginData = await api.post(`login`, authForm);

  expect(loginData.user).toEqual(registerData.user);

  const meData = await api.get(`me`, {
    headers: {
      Authorization: `Bearer ${loginData.user.token}`,
    },
  });

  expect(meData.user).toEqual(loginData.user);
});
