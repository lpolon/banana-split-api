/*
bcrypt.hash() já retorna uma promise A única vantagem de separar essa função é "fixar" o saltRounds. É um uso adequado de promise de qualquer forma.
*/

import bcrypt from 'bcrypt'

export async function hashPassword(user) {
  const password = user.password
  const saltRounds = 10

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return reject(err)
      resolve(hash)
    })
  })
  return hashPassword
}