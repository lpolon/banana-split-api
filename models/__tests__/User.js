import {connectAndDrop, disconnect} from '../../test/utils/database'
import {User} from '../../models/User'
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
    const {
      errors: {
        username: {message, kind},
      },
    } = user.validateSync()
    expect(message).toStrictEqual('Path `username` is required.')
    expect(kind).toStrictEqual('required')
  })
})
