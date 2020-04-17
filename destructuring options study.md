```javascript
import { Schema, model } from 'mongoose';

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
    },
    email: {
      type: String,
      required: true,
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

export const User = model('User', userSchema);
```

```javascript
router.post('/', async (req, res, next) => {
  // get values from req.body
  const { username, password, email } = req.body;
  try {
    // hash
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);
    // create document
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });
    // save -> this will trigger the pre-save validation hooks
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: `new user ${savedUser.username} saved sucessfully` });
  } catch (error) {
    // now i want to catch validation errors.

    /*OPTION 1 - DON'T: */ const usernameErrorMessage =
      error.errors.username.message; // throws an TypeError. Cannot read property message of undefined which will likely send a status(500) error while it is a bad request (400) and no useful error message back to the browser.

    /*
    OPTION 2 - DON'T:
    */
    const { message: usernameErrorMessage } = error.errors.username; // throws type error

    /* OPTION 3 - OK */ const usernameErrorMessage =
      error &&
      error.errors &&
      error.errors.username &&
      error.errors.username.message; // usernameErrorMessage will return undefined and can be handled

    /* OPTION 4 - OK */ const usernameErrorMessage =
      error?.errors?.username?.message; // optional chain operator. requires babel.

    /* OPTION 5 - OK */
    const {username: {message: usernameErrorMessage}} = error.errors
    // undefined

    // moreover: accepts default value if you want something other than undefined
    const {username: {message: usernameErrorMessage = 'default value usernameErrorMEssage'} = 'default value username'} = error.errors

    if (typeof errorMessage === 'undefined') return res.sendStatus(400); // 500 aqui

    res.status(400).json({ error: errorMessage });
    console.log;
    return next(error);
  }
});
```
