import {connectAndDrop, disconnect} from '../../test/util/database'
import {User} from '../../models/User'
import {getMongooseValidationSyncError} from '../../test/util/mongoose-validate'
describe('the username path:', () => {
  beforeEach(connectAndDrop)
  afterEach(disconnect)
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
