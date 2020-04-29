import mongoose from 'mongoose';
import axios from 'axios';
import startServer from '../server';
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

test('auth flow', async () => {
  const authForm = { username: 'abcd', password: 'Abc123!' };
  const registerResult = await axios.post(
    `http://localhost:${port}/api/auth/register`,
    authForm,
  );
  expect(registerResult.data.user).toEqual({
    /*
    .any() asymetrical matches. assertions about types in general.
    */
    token: expect.any(String),
    _id: expect.any(String),
    username: authForm.username,
  });

  const loginResult = await axios.post(
    `http://localhost:${port}/api/auth/login`,
    authForm,
  );

  expect(loginResult.data.user).toEqual(registerResult.data.user);

  const meResult = await axios.get(`http://localhost:${port}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${loginResult.data.user.token}`,
    },
  });

  expect(meResult.data.user).toEqual(loginResult.data.user);
});
