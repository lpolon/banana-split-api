import { buildReq, buildRes, buildNext } from '../../../test/util/generate';
import { UnauthorizedError } from 'express-jwt';
import { errorMiddleware } from '../error-middleware';

test('responds with 401 for express-jwt UnauthorizedError', () => {
  const code = 'some_error_code';
  const message = 'some error message';
  const error = new UnauthorizedError(code, { message });
  const req = buildReq();
  const res = buildRes();
  const next = buildNext();
  errorMiddleware(error, req, res, next);
  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    code: error.code,
    message: error.message,
  });
  expect(res.json).toHaveBeenCalledTimes(1);
});

test('calls next if headersSent is true', () => {
  const error = new Error(`doesn't matter in this test`);
  const req = buildReq();
  const res = buildRes({ headersSent: true });
  const next = buildNext();
  errorMiddleware(error, req, res, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith(error);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});

test('responds with 500 and the error object', () => {
  const error = new Error('whatever');
  const req = buildReq();
  const res = buildRes();
  const next = buildNext();

  errorMiddleware(error, req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: error.message,
    stack: error.stack,
  });
  expect(res.json).toHaveBeenCalledTimes(1);
});
