import mongoose from 'mongoose';
import { User } from '../User';
import { resolve } from '../../../test/util/async';
import * as generate from '../../../test/util/generate';

describe('the username path:', () => {
  it('is a string', () => {
    const username = generate.username();
    const user = new User({
      username,
    });
    expect(user.username).toStrictEqual(username);
  });
  it('is required', () => {
    const emptyUsername = '';
    const user = new User({
      username: emptyUsername,
    });
    const error = user.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: Path \`username\` is required.]`,
    );
  });
  it('invalidates usernames with less than 3 characters', () => {
    const shortUsername = '1_';
    const user = new User({
      username: shortUsername,
    });
    const error = user.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: invalid username]`,
    );
  });

  it('invalidates usernames with white spaces', () => {
    const usernameWithWhiteSpace = 'leo polon';
    const user = new User({
      username: usernameWithWhiteSpace,
    });

    const error = user.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: invalid username]`,
    );
  });

  it('invalidates usernames with non-alphanumerical values', () => {
    const invalidUsername = '@leo';
    const user = new User({
      username: invalidUsername,
    });

    const error = user.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: invalid username]`,
    );
  });
});

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
    const user = new User({
      username,
    });

    const savedUser = await user.save();
    const queryResult = await User.findOne({ username: savedUser.username });

    expect(queryResult._id).toStrictEqual(savedUser._id);
    done();
  });

  it('throws validation error when #username already exists', async done => {
    const username = generate.username();
    const user = new User({
      username,
    });

    const sameUser = new User({
      username,
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
