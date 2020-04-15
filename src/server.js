import {config} from 'dotenv'
config()
import express from 'express'
const app = express()

import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorHandler from 'errorhandler'

import mongoose from 'mongoose'

import indexRouter from './routes/index'
// setup to deal with DeprecationWarning:
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose
  .connect(process.env.MONGODB_URI, mongooseOptions)
  .then(res => {
    console.log(`Connected to Mongo! Database name: "${res.connection.name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo:', err)
  })

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api', indexRouter)

const PORT = process.env.PORT || 4000

// TODO: Lembrar: express pega erros síncronos, erros assíncronos precisam ser tratados chamando next(err) no catch()
app.use(errorHandler())

app.listen(PORT, () => {
  console.log(`server listening at ${PORT}...`)
})

export default app
