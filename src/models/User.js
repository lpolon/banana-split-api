import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      // validate pode ser uma função, um array para custom err msg ou array de objetos: [{validator: validator, msg: 'lala'}]
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

async function isUsernameUnique(usernameValue, done) {
  try {
    const queryResult = await this.model('User').find({
      username: usernameValue,
    });
    return queryResult.length === 0 ? true : false;
  } catch (error) {
    throw Error(
      'Olá. isUserNameUnique foi rejeitada e isso jamais deveria acontecer. Boa sorte. Beijos de luz',
    );
  }
}

function isUsernameAllowed(usernameValue) {
  return (
    usernameValue.length >= 3 &&
    // metches a single white space
    !/\s/.test(usernameValue) &&
    // only alphanumeric
    !/\W/.test(usernameValue)
  );
}

export const User = model('User', userSchema);
