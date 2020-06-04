// https://github.com/kentcdodds/testing-node-apps/blob/master/test/utils/generate.js

import faker from 'faker';
import { getUserToken, getHashedPassword } from '../../src/util/auth';
// import User from '../../src/models/User';

const getUsername = faker.internet.userName;
// passwords must have at least these kinds of characters to be valid, so we'll
// prefex all of the ones we generate with `!0_Oo` to ensure it's valid.
const getPassword = (...args) => `!0_Oo${faker.internet.password(...args)}`;
const get_id = faker.random.uuid;
const getTimestamps = () => ({
  createdAt: faker.date.past(1),
  updatedAt: faker.date.between(faker.date.past(1), new Date()),
});

const randomPositiveInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function buildMany(factoryFn) {
  return Array.from({ length: randomPositiveInt(2, 5) }, factoryFn);
}

function buildGroup(overrides) {
  return {
    _id: get_id(),
    owner: get_id(),
    expenses: buildMany(buildExpense),
    settles: buildMany(buildSettle),
    groupName: faker.lorem.words(2),
    members: buildMany(getUsername),
    description: faker.lorem.sentence(),
    date: faker.date.recent(20),
    ...getTimestamps(),
    ...overrides,
  };
}

async function buildUser({ password = getPassword(), ...overrides } = {}) {
  const _id = get_id();
  const {
    groups = overrides.groups
      ? overrides.groups
      : buildMany(() => buildGroup({ owner: _id })),
  } = overrides;
  return {
    _id,
    username: getUsername(),
    password: await getHashedPassword(password),
    groups,
    ...getTimestamps(),
    ...overrides,
  };
}

// TODO: groups, settles and expenses estão representando mal o próprio schema, principalmente em relação à relação de Owner e Id. Isso provavelmente vai precisar ser alterado durante os testes.
function buildSettle(overrides) {
  return {
    _id: get_id(),
    owner: get_id(),
    value: faker.random.number(),
    paidBy: getUsername(),
    paidTo: getUsername(),
    ...getTimestamps(),
    ...overrides,
  };
}

function buildExpense(overrides) {
  return {
    _id: get_id(),
    owner: get_id(),
    description: faker.lorem.sentence(),
    value: faker.random.number(),
    split: {
      paidBy: getUsername(),
      dividedBy: buildMany(getUsername),
      isDividedByAll: true,
    },
    ...getTimestamps(),
    ...overrides,
  };
}

// not in use yet. Just brought from kent's project
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
async function buildReq({ user, ...overrides } = {}) {
  user = user ? user : await buildUser();
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
  buildGroup,
  buildSettle,
  buildExpense,
  buildMany,
  getUsername as username,
  getPassword as password,
  get_id,
  loginForm,
  token,
};
