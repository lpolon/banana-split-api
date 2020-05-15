import * as authController from '../auth-controller';
import * as generate from '../../../test/util/generate';
import { User } from '../../models/User';

jest.mock('../../models/User');

beforeEach(jest.clearAllMocks);

test('authController.register() returns status 400 when password is not strong enough', async done => {
  const invalidPassword = 'password';
  const body = generate.loginForm({ password: invalidPassword });
  const req = generate.buildReq({ user: null, body });
  const res = generate.buildRes();

  await authController.register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: `password is not strong enough`,
  });
  done();
});

test('authController.register() calls userDoc.save() once', async done => {
  const body = generate.loginForm();
  const req = generate.buildReq({ user: null, body });
  const res = generate.buildRes();
  const next = generate.buildNext();
  await authController.register(req, res, next);

  expect(User.create).toHaveBeenCalledTimes(1);
  done();
});
