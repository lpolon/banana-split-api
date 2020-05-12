import faker from 'faker';
export const getUsername = faker.internet.userName;
// passwords must have at least these kinds of characters to be valid, so we'll
// prefex all of the ones we generate with `!0_Oo` to ensure it's valid.
const getPassword = (...args) => `!0_Oo${faker.internet.password(...args)}`;
function loginForm(overrides) {
  return {
    username: getUsername(),
    password: getPassword(),
    ...overrides,
  };
}

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

export {
  buildRes,
  buildNext,
  getUsername as username,
  getPassword as password,
  loginForm,
};
