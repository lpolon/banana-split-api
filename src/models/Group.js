import { Schema, model } from 'mongoose';
import { User } from './User';
const groupSchema = new Schema(
  {
    groupName: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: {
      type: [String],
      // TODO: validate strings: only alpha, no duplicates, max char
    },
    description: String,
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Expense',
      },
    ],
    settles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Settle',
      },
    ],
    date: Date,
  },
  {
    timestamps: true,
  },
);

// TODO: test it
groupSchema.post('save', async doc => {
  await User.findByIdAndUpdate(doc.owner, { $push: { groups: doc._id } });
});

groupSchema.post('findOneAndDelete', async doc => {
  await User.findByIdAndUpdate(doc.owner, { $pull: { groups: doc._id } });
});

export const Group = model('Group', groupSchema);
