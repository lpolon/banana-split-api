import {Schema, model} from 'mongoose'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      // validate pode ser uma função, um array para custom err msg ou array de objetos: [{validator: validator, msg: 'lala'}]
      validate: [
        {
          validator: isUsernameUnique,
          msg: 'Username already taken',
        },
        {
          validator: isUsernameAllowed,
          msg: 'invalid username',
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
)
/*
 TODO: De quem é a responsabilidade de cryptgrafar o pw?
 O delete: buscar e deletar groupos do mesmo usuário
*/

// userSchema.path('username').validate(function(value, done) {

// })

/*
https://mongoosejs.com/docs/api.html#schematype_SchemaType-validate
é uma função async, então retorna uma Promise. on resolve, true ou undefined === validation passed, false ou falsy === validation failed. É um .pre('save') hook middleware que roda on .save() ou .validade(). Se a função fosse síncrona, validar com validateSync().

No mais: Se eu precisar de novo de validação única, por favor, abstraia melhor.
*/
async function isUsernameUnique(usernameValue, done) {
  try {
    const queryResult = await this.model('User').find({username: usernameValue})
    return queryResult.length === 0 ? true : false
  } catch (error) {
    throw Error(
      'Olá. isUserNameUnique foi rejeitada e isso jamais deveria acontecer. Boa sorte. Beijos de luz',
    )
  }
}

// TODO: talvez precise dividir isso, dependendo de como as mensagens de erro chegar no cliente.
function isUsernameAllowed(usernameValue) {
  return (
    usernameValue.length >= 3 &&
    // metches a single white space
    !/\s/.test(usernameValue) &&
    // only alphanumeric
    !/\W/.test(usernameValue)
  )
}

export const User = model('User', userSchema)
