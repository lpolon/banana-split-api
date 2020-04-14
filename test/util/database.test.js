import mongoose from 'mongoose'
import {connectAndDrop, disconnect, options} from './database'
import {User} from '../../src/models/User'

describe('The model test setup', () => {
  const MONGODB_URI_DB = 'mongodb://localhost/banana_TEST_DB'
  afterAll(async done => {
    await mongoose.connection.close()
    done()
  })

  describe('connectAndDrop()', () => {
    afterEach(async done => {
      await mongoose.disconnect()
      done()
    })
    it('resolves and is undefined', async done => {
      // i didn't find a way to just test if it resolves. It is not important if it returns or not.
      await expect(connectAndDrop()).resolves.toBeUndefined()
      done()
    })
    it('calls mongoose connect once', async done => {
      jest.spyOn(mongoose, 'connect')
      await connectAndDrop()
      expect(mongoose.connect).toHaveBeenCalledTimes(1)

      // clean up
      await mongoose.connect.mockRestore()
      done()
    })
    // tentei várias coisas e acabei testando "como eu faria pra conferir na mão"
    it('empties all collections after been called', async done => {
      await mongoose.connect(MONGODB_URI_DB, options)
      await mongoose.connection.db.dropDatabase()
      const user = new User({
        username: 'leo',
      })
      await user.save()
      const queryResult = await User.find()
      expect(queryResult.length).toStrictEqual(1)

      await mongoose.disconnect()

      await connectAndDrop()

      const newQueryResult = await User.find()
      expect(newQueryResult.length).toStrictEqual(0)
      done()
    })
  })
  describe('disconnect()', () => {
    beforeEach(async done => {
      await mongoose.connect(MONGODB_URI_DB, options)
      done()
    })
    it('calls mongoose.disconnect()', async done => {
      jest.spyOn(mongoose, 'disconnect')

      await disconnect()

      expect(mongoose.disconnect).toHaveBeenCalledTimes(1)

      await mongoose.disconnect.mockRestore()
      done()
    })
  })
})
