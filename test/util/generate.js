import faker from 'faker';
export const getUsername = faker.internet.userName;

const buildRes = (overrides = {}) => {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides,
  };
  return res;
};

const buildNext = implementationFn =>
  jest.fn(implementationFn).mockName('next');

export { buildRes, buildNext, getUsername as username };
