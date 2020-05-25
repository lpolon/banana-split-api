import { Schema, model } from 'mongoose';
import { Group } from './Group';

const settleSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    paidBy: { type: String, required: true },
    PaidTo: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

settleSchema.post('save', async doc => {
  Group.findByIdAndUpdate(doc.owner, {
    $push: { settles: doc._id },
  });
});

settleSchema.post('findOneAndDelete', async doc => {
  await Group.findByIdAndUpdate(doc.owner, {
    $pull: { settles: doc._id },
  });
});

export const Settle = new model('Settle', settleSchema);
