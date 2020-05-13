import { Group } from '../models/Group';

export async function getGroups(req, res, next) {
  const {
    user: { _id: userId },
  } = req;
  try {
    const foundGroups = await Group.find({ owner: userId });
    res.status(200).json(foundGroups);
  } catch (error) {
    next(error);
  }
}

export async function createGroup(req, res, next) {
  const {
    body: { groupName, description = '', date },
    user: { _id: userId },
  } = req;
  try {
    const newGroupDoc = new Group({
      groupName,
      description,
      date,
      owner: userId,
    });
    const newGroup = await newGroupDoc.save();
    res.status(201).json({
      message: `new group created sucessfully`,
      group: newGroup,
    });
  } catch (error) {
    next(error);
  }
}
