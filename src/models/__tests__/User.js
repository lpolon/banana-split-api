import mongoose from 'mongoose';
import { User } from '../User';
import { resolve } from '../../../test/util/async';
describe('the username path:', () => {
  it('is a string', () => {
    const user = new User({
      username: 'Léo',
    });
    expect(user.username).toStrictEqual('Léo');
  });
  it('is required', () => {
    const user = new User({
      username: '',
    });
    const error = user.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: Path \`username\` is required.]`,
    );
  });
  it('invalidates usernames with less than 3 characters', () => {
    const shortUsername1 = new User({
      username: '1_',
    });
    const error = shortUsername1.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: invalid username]`,
    );
  });

  it('invalidates usernames with white spaces', () => {
    const usernameWithWhiteSpace = new User({
      username: 'leo polon',
    });

    const error = usernameWithWhiteSpace.validateSync();
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: invalid username]`,
    );
  });

  it('invalidates usernames with non-alphanumerical values', () => {
    const invalidUsername1 = new User({
      username: '@leo',
    });
    const invalidUsername2 = new User({
      username: '(_)_)////D',
    });
    const error1 = invalidUsername1.validateSync();
    expect(error1).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: invalid username]`,
    );

    const error2 = invalidUsername2.validateSync();
    expect(error2).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: invalid username]`,
    );
  });
});

describe('the User model:', () => {
  const MONGODB_URI = 'mongodb://localhost/USER_TEST';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  beforeAll(() => mongoose.connect(MONGODB_URI, options));
  afterAll(() => mongoose.connection.close());
  beforeEach(() => mongoose.connection.dropDatabase());

  it('creates a new user', async done => {
    const username = new User({
      username: 'leo',
    });

    const savedUser = await username.save();
    const queryResult = await User.findOne({ username: savedUser.username });

    expect(queryResult._id).toStrictEqual(savedUser._id);
    done();
  });

  it('throws validation error when #username already exists', async done => {
    const username = new User({
      username: 'leopolon',
    });

    const sameUsername = new User({
      username: 'leopolon',
    });

    await expect(username.validate()).resolves.toBeUndefined();
    await username.save();

    const error = await sameUsername.validate().catch(resolve);
    expect(error).toMatchInlineSnapshot(
      `[ValidationError: User validation failed: username: Username already taken]`,
    );
    done();
  });

  it('saves more than one unique user', async done => {
    expect.assertions(3);
    const username1 = new User({
      username: 'leo',
    });

    const username2 = new User({
      username: 'Leo',
    });

    const savedUser1 = await username1.save();
    const queryResult1 = await User.findOne({ username: savedUser1.username });

    expect(String(queryResult1._id)).toStrictEqual(String(savedUser1._id));

    const result = await username2.validate();
    expect(result).toMatchInlineSnapshot(`undefined`);

    const savedUser2 = await username2.save();
    const queryResult2 = await User.findOne({ username: savedUser2.username });
    expect(queryResult2._id).toStrictEqual(savedUser2._id);
    done();
  });
});
