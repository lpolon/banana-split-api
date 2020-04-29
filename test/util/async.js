// https://github.com/kentcdodds/testing-node-apps/blob/tjs/test/utils/async.js
export const handleRequestFailure = ({ response: { status, data } }) => {
  const error = new Error(`${status}: ${JSON.stringify(data)}`);
  // remove parts of the stack trace so the error message (codeframe) shows up
  // at the code where the actual problem is.
  error.stack = error.stack
    .split('\n')
    .filter(
      line =>
        !line.includes('at handleRequestFailure') &&
        !line.includes('at processTicksAndRejections'),
    )
    .join('\n');
  error.status = status;
  error.data = data;
  return Promise.reject(error);
};

// convert a rejected promise into a resolved one with this identity function. So you can assert a returning value instead of inside a catch block. Nice!
export const resolve = r => r;

export const getData = res => res.data;
