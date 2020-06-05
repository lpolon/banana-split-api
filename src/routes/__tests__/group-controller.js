import {
  buildReq,
  buildRes,
  buildNext,
  buildUser,
  buildGroup,
  buildMany,
  get_id,
} from '../../../test/util/generate';
import { Group } from '../../models/Group';
import * as groupController from '../group-controller';

jest.mock('../../models/Group.js');

beforeEach(jest.clearAllMocks);

test('getOneGroup return the req.group', async done => {
  // no db call to check
  // no need for user in req
  // no mock value to resolve
  const group = buildGroup();
  const req = await buildReq({ group });
  const res = buildRes();

  groupController.getOneGroup(req, res);

  expect(res.json).toHaveBeenCalledWith({ group: req.group });
  expect(res.json).toHaveBeenCalledTimes(1);
  done();
});

test('getGroups return all groups from an User', async done => {
  // they way i created my test factories, I could just call buildUser() and get groups from it. I think that my intention is more clear this way.
  const userId = get_id();
  const groups = buildMany(() => buildGroup({ owner: userId }));
  const user = await buildUser({ groups, _id: userId });

  const req = await buildReq({ user });
  const res = buildRes();

  Group.find.mockResolvedValueOnce(groups);

  await groupController.getGroups(req, res);

  /*
  assertions:
    mockresolvedvalue to array of objects with all groups of a owner
    .find to have been called once
    res.json to have been called once with 200 and found groups
  */
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(groups);

  done();
});

// TODO: finish testing all groupControllers
