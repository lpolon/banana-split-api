import mongoose from 'mongoose'

export const MONGODB_URI = 'mongodb://localhost/banana_TEST'

export const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// TODO: Se eu não soubesse que funciona, nem fudendo eu iria confiar que está funcionando. Além disso, deveria estar usando algum mock aqui?
export const connectAndDrop = async () => {
  await mongoose.connect(MONGODB_URI, options)
  await mongoose.connection.db.dropDatabase()
}

export const disconnect = async () => {
  await mongoose.disconnect()
}
