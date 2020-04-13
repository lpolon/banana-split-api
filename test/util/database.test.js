import mongoose from 'mongoose'
import {connectAndDrop, disconnect, MONGODB_URI, options} from './database'
import {User} from '../../models/User'

// i understand it is a bit silly that i use done(), async AND then.. catch, however, for now it was important to me to try it out.

describe('The model test setup', () => {
  describe('connectAndDrop()', () => {
    afterEach(async done => {
      await mongoose.disconnect()
      done()
    })
    it('resolves the promise and returns undefined', () => {
      // i didn't find a way to just test if it resolves. It is not important if it returns or not.
      return expect(connectAndDrop()).resolves.toBeUndefined()
    })
    it('calls mongoose connect once', () => {
      jest.spyOn(mongoose, 'connect')
      return connectAndDrop().then(() =>
        expect(mongoose.connect).toHaveBeenCalledTimes(1),
      )
    })
    // tentei várias coisas e acabei testando "como eu faria pra conferir na mão"
    it('has empties all collections after been called', async done => {
      await mongoose.connect(MONGODB_URI, options)
      const user = new User({
        username: 'Léo',
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
      mongoose.connect(MONGODB_URI, options)
      done()
    })
    it('calls mongoose.disconnect()', () => {
      jest.spyOn(mongoose, 'disconnect')

      disconnect()

      return expect(mongoose.disconnect).toHaveBeenCalledTimes(1)
    })
  })
})
