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

test('getOneGroup return the req.group', async () => {
  // no db call to check
  // no need for user in req
  // no mock value to resolve
  const group = buildGroup();
  const req = await buildReq({ group });
  const res = buildRes();

  groupController.getOneGroup(req, res);

  expect(res.json).toHaveBeenCalledWith({ group: req.group });
  expect(res.json).toHaveBeenCalledTimes(1);
});

test('getGroups return all groups from an User', async () => {
  const userId = get_id();
  const groups = buildMany(() => buildGroup({ owner: userId }));
  const user = await buildUser({ groups, _id: userId });

  Group.find.mockResolvedValueOnce(groups);
  const req = await buildReq({ user });
  const res = buildRes();

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
});

test('setGroup sets group to req', async () => {
  const user = await buildUser();
  const group = buildGroup({ owner: user._id });
  Group.findById.mockResolvedValueOnce(group);
  const req = await buildReq({ user, params: { groupId: group._id } });
  const res = buildRes();
  const next = buildNext();

  await groupController.setGroup(req, res, next);

  expect(Group.findById).toHaveBeenCalledTimes(1);
  expect(Group.findById).toHaveBeenCalledWith(group._id);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith(/* nothing */);
});

test('setGroup returns a 404 error if the group does not exist', async () => {
  Group.findById.mockResolvedValueOnce(null);

  const fakeGroupId = 'FAKE_GROUP_ID';
  const req = await buildReq({ params: { groupId: fakeGroupId } });
  const res = buildRes();
  const next = buildNext();
  await groupController.setGroup(req, res, next);

  expect(Group.findById).toHaveBeenCalledTimes(1);
  expect(Group.findById).toHaveBeenCalledWith(fakeGroupId);

  expect(next).not.toHaveBeenCalled();

  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(404);

  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No group was found with the id of FAKE_GROUP_ID",
      },
    ]
  `);
});

test.todo(
  'setGroup return a 403 error if the user is not the owner of the group',
);

// TODO: finish testing all groupControllers
