import { Group } from '../models/Group';

export async function setGroup(req, res, next) {
  const { groupId } = req.params;
  try {
    const foundGroup = await Group.findById(groupId);
    if (!foundGroup)
      return res
        .status(404)
        .json({ message: `No group was found with the id of ${groupId}` });
    if (req.user._id === foundGroup.owner) {
      req.group = foundGroup;
      return next();
    } else {
      return res.status(403).json({
        message: `User with id ${req.user._id} is not authorized to access the list item ${groupId}`,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getGroups(req, res, next) {
  const {
    user: { _id: userId },
  } = req;
  try {
    const foundGroups = await Group.find({ owner: userId });
    return res.status(200).json(foundGroups);
  } catch (error) {
    next(error);
  }
}

export function getOneGroup(req, res) {
  return res.json({ group: req.group });
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
    const newGroup = await Group.create(newGroupDoc);
    return res.status(201).json({
      message: `new group created sucessfully`,
      group: newGroup,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteGroup(req, res, next) {
  const { _id } = req.group;
  try {
    await Group.findByIdAndDelete(_id);
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function updateGroup(req, res, next) {
  const {
    group: { _id },
    group,
  } = req;
  try {
    await Group.findByIdAndUpdate(_id, req.body, { new: true });
    return res.status(200).json({
      message: `${group.groupName} updated successfully`,
      group,
    });
  } catch (error) {
    next(error);
  }
}
