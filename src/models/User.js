import { Schema, model } from 'mongoose';
import { isUsernameAllowed, isPasswordAllowed } from '../util/auth';
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      validate: [
        {
          validator: isUsernameUnique,
          message: 'Username already taken',
        },
        {
          validator: isUsernameAllowed,
          message: 'invalid username',
        },
      ],
    },
    password: {
      type: String,
      required: true,
      validate: [
        {
          validator: isPasswordAllowed,
          message: 'password is not strong enough',
        },
      ],
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
  },
  {
    timestamps: true,
  },
);

async function isUsernameUnique(username) {
  const queryResult = await this.model('User').find({
    username,
  });
  return queryResult.length === 0 ? true : false;
}

export const User = model('User', userSchema);
