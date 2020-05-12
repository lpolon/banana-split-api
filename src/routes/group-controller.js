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
