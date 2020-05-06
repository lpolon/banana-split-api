// TODO: Kent's repo use faker to generate username, password, build user and pass it to req.

export const buildRes = (overrides = {}) => {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides,
  };
  return res;
};

export const buildNext = implementationFn =>
  jest.fn(implementationFn).mockName('next');
