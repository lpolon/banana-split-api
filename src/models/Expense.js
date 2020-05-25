import { Schema, model } from 'mongoose';
import { Group } from './Group';

const expenseSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    split: {
      paidBy: { type: String, required: true },
      dividedBy: { type: [String], required: true },
      isDividedByAll: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

expenseSchema.post('save', async doc => {
  await Group.findByIdAndUpdate(doc.owner, {
    $push: { groups: doc._id },
  });
});

expenseSchema.post('findOneAndDelete', async doc => {
  await Group.findByIdAndUpdate(doc.owner, {
    $pull: { groups: doc._id },
  });
});

export const Expense = model('Expense', expenseSchema);
