import {Schema, model} from 'mongoose'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
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
 TODO: De que é a responsabilidade de cryptgrafar o pw?
 O delete: buscar e deletar groupos do mesmo usuário
*/
export const User = model('User', userSchema)
