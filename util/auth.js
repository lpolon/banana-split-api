/*
bcrypt.hash() já retorna uma promise A única vantagem de separar essa função é "fixar" o saltRounds. É um uso adequado de promise de qualquer forma.
*/

import bcrypt from 'bcrypt'

export function hashPassword(password) {
  const saltRounds = 10
  // TODO: Dúvida: Eu deveria retornar o salt?
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return reject(err)
      resolve(hash)
    })
  })
}

export function isPasswordAllowed(password) {
  return (
    password.length > 6 &&
    // non-alphanumeric
    /\W/.test(password) &&
    // digit
    /\d/.test(password) &&
    // capital letter
    /[A-Z]/.test(password) &&
    // lowercase letter
    /[a-z]/.test(password)
  )
}
