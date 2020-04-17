import { Router } from 'express';
import { User } from '../models/User';
import { compare } from 'bcrypt';

import { sign } from 'jsonwebtoken';

import { generateAccessToken } from '../util/auth';

const router = Router();

/*
refresh tokens:
coloca expiration date to access token
usar short expiration date a access token e renovar conforma é feito requests.
refrash token também é um token. O principal motivo é conseguir invalidar usuários que tem o token, mas não deveriam mais ter acesso.
Importante que esse sistema também permite, com facilidade, separar os servidor de autorização do resto.
*/

/*
  Não seria bem login, mas um controller de auth.

  uma segunda rota para verificar se ele possui o refresh token.

  TODO: Eu não estou convencido das vantagens do refresh token.
  lendo sobre:
  - https://stackoverflow.com/questions/37959945/how-to-destroy-jwt-tokens-on-logout

  - https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens

  logout? destruir no cliente?
  evitar login do lado do servidor:
  - checkar expiration date;
  - blacklist de jwt;

*/
// api/login/token. Arrumar depois
router.post('/token', (req, res, next) => {
  const refreshToken = req.body.token;
  // se não tiver refresh token, return res.sendStatus(401)
  // buscar o refresh token o banco de dados
  // se não encontrar: sendStatus(403)

  // se encontrar: remover informações desnecessárias e mandar o novo token com user._id ou o que seja
});

router.delete('/logout', (req, res) => {
  // find and delete refresh token from database.
});

router.post('/', async (req, res, next) => {
  const { username, password: inputtedPassword } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser)
      return res.status(401).json({ message: 'wrong credentials' });

    // authenticate user
    const { password: savedHashedPassword } = foundUser;
    const isValidPw = await compare(inputtedPassword, savedHashedPassword);
    if (!isValidPw)
      return res.status(401).json({ message: 'wrong credentials' });

    // if authenticated, send jwt that can be used for authorization
    const claims = { sub: foundUser._id };
    const accessToken = generateAccessToken(claims);
    const refreshToken = sign(claims, process.env.REFRESH_TOKEN_SECRET); // no expiration date in this one
    // save it to a database.
    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
