import {Router} from 'express'
import {User} from '../models/User'

import {isPasswordAllowed, hashPassword} from '../../util/auth'

const router = Router()

router.post('/', async (req, res, next) => {
  const {username, password} = req.body

  if (!password)
    return res.status(400).json({message: `password can't be blank`})

  if (!isPasswordAllowed(password))
    return res.status(400).json({message: `password is not strong enough`})

  try {
    const hashedPassword = await hashPassword(password)
  } catch (error) {
    next(error)
  }
  const newUser = new User({
    username,
    password: hashPassword,
  })
  try {
    const savedUser = await newUser.save()
    // response should send token
    res
      .status(201)
      .json({message: `new user ${savedUser.username} saved sucessfully`})
  } catch (error) {
    // Não realmente consegui pensar num caso em que caia nesse catch e o erro não contenha o erro de validação.
    const usernameObj = error?.errors?.username
    if (typeof usernameObj === 'undefined') return res.sendStatus(500)
    const {message} = usernameObj
    res.status(400).json({error: message})
    return next(error)
  }
})

export default router
