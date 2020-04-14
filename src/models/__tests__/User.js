import {connectAndDrop, disconnect} from '../../../test/util/database'
import {User} from '../User'
import {getMongooseValidationSyncError} from '../../../test/util/mongoose-validate'
describe('the username path:', () => {
  it('is a string', () => {
    const user = new User({
      username: 'Léo',
    })
    expect(user.username).toStrictEqual('Léo')
  })
  it('is required', () => {
    const user = new User({
      username: '',
    })
    const [message, kind] = getMongooseValidationSyncError(user, 'username')
    expect(message).toStrictEqual('Path `username` is required.')
    expect(kind).toStrictEqual('required')
  })
  it('invalidates usernames with less than 3 characters', () => {
    const shortUsername1 = new User({
      username: '1_',
    })
    const [message, kind] = getMongooseValidationSyncError(
      shortUsername1,
      'username',
    )
    expect(kind).toStrictEqual('user defined')
    expect(message).toStrictEqual('invalid username')
  })
  it('invalidates usernames with white spaces', () => {
    const usernameWithWhiteSpace = new User({
      username: 'leo polon',
    })

    const [message, kind] = getMongooseValidationSyncError(
      usernameWithWhiteSpace,
      'username',
    )

    expect(kind).toStrictEqual('user defined')
    expect(message).toStrictEqual('invalid username')
  })

  it('invalidates usernames with non-alphanumerical values', () => {
    const invalidUsername1 = new User({
      username: '@leo',
    })
    const invalidUsername2 = new User({
      username: '(_)_)////D',
    })

    const [message1, kind1] = getMongooseValidationSyncError(
      invalidUsername1,
      'username',
    )
    const [message2, kind2] = getMongooseValidationSyncError(
      invalidUsername2,
      'username',
    )

    expect(kind1).toStrictEqual('user defined')
    expect(message1).toStrictEqual('invalid username')

    expect(kind2).toStrictEqual('user defined')
    expect(message2).toStrictEqual('invalid username')
  })
})

describe('the User model:', () => {
  beforeEach(connectAndDrop)
  afterEach(disconnect)
  it('creates a new user', async done => {
    const username = new User({
      username: 'leo',
    })

    const savedUser = await username.save()
    const queryResult = await User.findOne({username: savedUser.username})

    expect(queryResult._id).toStrictEqual(savedUser._id)
    done()
  })

  it('throws validation error when #username already exists', async done => {
    expect.assertions(3)
    const username = new User({
      username: 'leopolon',
    })

    const sameUsername = new User({
      username: 'leopolon',
    })

    await expect(username.validate()).resolves.toBeUndefined()
    await username.save()

    try {
      await sameUsername.validate()
    } catch (error) {
      const {
        errors: {
          username: {message, kind},
        },
      } = error
      expect(message).toStrictEqual('Username already taken')
      expect(kind).toStrictEqual('user defined')
    }
    done()
  })

  it('saves new user when #username is unique', async done => {
    expect.assertions(3)
    const username1 = new User({
      username: 'leo',
    })

    const username2 = new User({
      username: 'Leo',
    })

    const savedUser1 = await username1.save()
    const queryResult1 = await User.findOne({username: savedUser1.username})

    expect(String(queryResult1._id)).toStrictEqual(String(savedUser1._id))

    await expect(username2.validate()).resolves.toBeUndefined()

    const savedUser2 = await username2.save()
    const queryResult2 = await User.findOne({username: savedUser2.username})
    expect(queryResult2._id).toStrictEqual(savedUser2._id)
    done()
  })
})
