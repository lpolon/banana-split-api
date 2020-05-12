// https://github.com/kentcdodds/testing-node-apps/blob/master/test/utils/generate.js

import faker from 'faker';
import { getUserToken, getHashedPassword } from '../../src/util/auth';

export const getUsername = faker.internet.userName;
// passwords must have at least these kinds of characters to be valid, so we'll
// prefex all of the ones we generate with `!0_Oo` to ensure it's valid.
const getPassword = (...args) => `!0_Oo${faker.internet.password(...args)}`;
const get_id = faker.random.uuid;

// update it if the user changes
async function buildUser({ password = getPassword(), ...overrides } = {}) {
  return {
    _id: get_id(),
    username: getUsername(),
    password: await getHashedPassword(password),
    // Array of group's _id.
    groups: [],
    ...overrides,
  };
}

// not yet in use. Just brought from kent's project
function token(user) {
  return getUserToken(buildUser(user));
}

function loginForm(overrides) {
  return {
    username: getUsername(),
    password: getPassword(),
    ...overrides,
  };
}

// update it as the app have more stuff in the req
function buildReq({ user = buildUser(), ...overrides } = {}) {
  const req = { user, body: {}, params: {}, ...overrides };
  return req;
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
  buildReq,
  buildRes,
  buildNext,
  buildUser,
  getUsername as username,
  getPassword as password,
  get_id as _id,
  loginForm,
  token,
};
