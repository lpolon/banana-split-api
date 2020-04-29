import mongoose from 'mongoose';
import axios from 'axios';
import startServer from '../server';
const MONGODB_URI_DB = 'mongodb://localhost/banana_TEST_AUTH';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
/*
  if i was returning something that would be used throughout the tests, you can define an async callback calling your Promise returning functions.
  e.g.: beforeEach(async () => {
    const server = await connectAndDrop()
  })
  in this case, jest will wait prom resolution bacause we're returing it with arrow's function implicit return
*/
let server;
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
  // console.log('server:', server);
  const response = await axios.post('http://localhost:5001/api/auth/register', {
    username: 'abcd',
    password: 'Abc123!',
  });
  console.log('response:', response.data);
});
