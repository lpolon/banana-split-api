import mongoose from 'mongoose'

const MONGODB_URI = 'mongodb://localhost/banana_TEST'

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

export const connectAndDrop = async () => {
  await mongoose.connect(MONGODB_URI, options)
  await mongoose.connection.db.dropDatabase()
}

export const disconnect = async () => {
  await mongoose.disconnect()
}
