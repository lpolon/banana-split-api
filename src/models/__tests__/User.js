import mongoose from 'mongoose';
import { User } from '../User';
import { resolve } from '../../../test/util/async';
import * as generate from '../../../test/util/generate';

describe('the username path:', () => {
  it('is required', () => {
    const emptyUsername = '';
    const password = generate.password();
    const user = new User({
      username: emptyUsername,
      password,
    });
    const error = user.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: Path \`username\` is required.]`,
    );
  });
  it('throws ValidationError for invalid usernames', () => {
    const invalidUsername = '1_';
    const password = generate.password();
    const user = new User({
      username: invalidUsername,
      password,
    });
    const error = user.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: invalid username]`,
    );
  });
});

describe('the password path', () => {
  it('is required', () => {
    const username = generate.username();
    const emptyPassword = '';
    const user = new User({
      username,
      password: emptyPassword,
    });
    const error = user.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: password: Path \`password\` is required.]`,
    );
  });
  it('throws validation error for invalid password', () => {
    const username = generate.username();
    const invalidPassword = 'password';
    const user = new User({
      username,
      password: invalidPassword,
    });

    const error = user.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: password: password is not strong enough]`,
    );
  });
});

// TODO: How kent does this kind of test in his course?
// TODO: test groups when group is deleted or created
describe('the User model:', () => {
  const MONGODB_URI = 'mongodb://localhost/USER_TEST_2';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  beforeAll(() => mongoose.connect(MONGODB_URI, options));
  afterAll(() => mongoose.connection.close());
  beforeEach(() => mongoose.connection.dropDatabase());

  it('creates a new user', async done => {
    const username = generate.username();
    const password = generate.password();
    const user = new User({
      username,
      password,
    });

    const savedUser = await user.save();
    const queryResult = await User.findOne({ username: savedUser.username });

    expect(queryResult._id).toStrictEqual(savedUser._id);
    done();
  });
  it('throws validation error when #username already exists', async done => {
    const username = generate.username();
    const password = generate.password();
    const user = new User({
      username,
      password,
    });

    const password2 = generate.password();
    const sameUser = new User({
      username,
      password: password2,
    });

    await expect(user.validate()).resolves.toBeUndefined();
    await user.save();

    const error = await sameUser.validate().catch(resolve);
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: Username already taken]`,
    );
    done();
  });
});
