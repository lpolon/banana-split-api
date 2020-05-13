import mongoose from 'mongoose';
import { User } from '../../src/models/User';
import * as generate from '../util/generate';

const MONGODB_URI = 'mongodb://localhost/banana_SETUP_TEST_DROP';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

describe('The model test setup', () => {
  beforeAll(() => mongoose.connect(MONGODB_URI, options));
  afterAll(() => mongoose.connection.close());

  test('mongoose.connection.dropDatabase() empties all collections after being called', async done => {
    const user = new User({
      username: generate.username(),
      password: generate.password(),
    });

    await user.save();

    const queryResult = await User.find();
    expect(queryResult.length).toStrictEqual(1);

    await mongoose.connection.dropDatabase();

    const newQueryResult = await User.find();
    expect(newQueryResult.length).toStrictEqual(0);
    done();
  });
});
