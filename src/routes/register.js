import {Router} from 'express'
import {User} from '../models/User'

import {isPasswordAllowed} from '../util/auth'

import bcrypt from 'bcrypt'

const router = Router()

router.post('/', async (req, res, next) => {
  const {username, password} = req.body

  if (!password)
    return res.status(400).json({message: `password can't be blank`})

  if (!isPasswordAllowed(password))
    return res.status(400).json({message: `password is not strong enough`})
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const newUser = new User({
      username,
      password: hashedPassword,
    })
    const savedUser = await newUser.save()
    // response should send token
    res
      .status(201)
      .json({message: `new user ${savedUser.username} saved sucessfully`})
  } catch (error) {
    const usernameObj = error?.errors?.username
    if (typeof usernameObj === 'undefined') return res.sendStatus(500)
    const {message} = usernameObj
    res.status(400).json({error: message})
    return next(error)
  }
})

export default router
