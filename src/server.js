import express from 'express'
const app = express()

import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorHandler from 'errorhandler'

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))

// app.use('/api', apiRouter)

const PORT = process.env.PORT || 4000

app.use(errorHandler())

app.listen(PORT, () => {
  console.log(`server listening at ${PORT}...`)
})

export default app