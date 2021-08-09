import Joi from 'joi';

export const loginSchema = Joi.object().keys({
  username: Joi.string().lowercase().required().messages({
    'string.base': 'username should be of type string.',
    'any.required': 'username is a required field.',
  }),
  password: Joi.string().required().messages({
    'string.base': 'password should be of type string.',
    'any.required': 'password is a required field.',
  }),
});

export const signUpSchema = loginSchema.keys({
  email: Joi.string().email().lowercase().required().messages({
    'string.base': 'email should be of type string.',
    'string.email': 'Please provide a valid email.',
    'any.required': 'email is a required field.',
  }),
  name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'name should be of type string.',
    'string.min': 'name should be at least 2 characters long.',
    'string.max': 'name should be no longer than 50 characters.',
    'any.required': 'name is a required field.',
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'string.base': 'email should be of type string.',
    'string.email': 'Please provide a valid email.',
    'any.required': 'email is a required field.',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^a-zA-Z]).{8,}$'))
    .required()
    .messages({
      'string.base': 'password should be of type string.',
      'string.pattern.base':
        'Password must be at least 8 characters in length and include an uppercase letter, lowercase letter and a number or symbol.',
      'any.required': 'password is a required field.',
    }),
  token: Joi.string().required(),
});

const exercise = Joi.object({
  name: Joi.string().min(1).required().messages({
    'string.base': 'name for each exercise should be of type string.',
    'string.min': 'name for each exercise should be at least 1 character long.',
    'any.required': 'a name for each exercise is required.',
  }),
  sets: Joi.number().min(1).max(15).required().messages({
    'number.base': 'sets for each exercise should be of type number.',
    'number.min': 'each exercise should be at least 1 set.',
    'number.max': 'each exercise should be no more than 15 sets.',
    'any.required': 'each exercise should include a number of sets.',
  }),
  reps: Joi.number().min(1).max(100).required().messages({
    'number.base': 'reps for each exercise should be of type number.',
    'number.min': 'each exercise should be at least 1 rep.',
    'number.max': 'each exercise should be no more than 100 reps.',
    'any.required': 'each exercise should include a number of reps.',
  }),
  unilateral: Joi.bool(),
});

export const workoutSchema = Joi.object({
  uid: Joi.string().required().messages({
    'string.base': 'uid should be of type string.',
    'any.required': 'uid is a required field',
  }),
  title: Joi.string().required().messages({
    'string.base': 'title should be of type string.',
    'string.min': 'title should be at least 1 character long.',
    'string.max': 'title should be no longer than 50 characters.',
    'any.required': 'title is a required field',
  }),
  details: Joi.string().allow(''),
  exercises: Joi.array().min(1).items(exercise).required().messages({
    'array.base': 'exercises should be of type array.',
    'array.min': 'Please include at least one exercise in exercises.',
    'any.required': 'exercises is a required field.',
  }),
});

export const homeFeedSchema = Joi.object({
  uid: Joi.string().required().messages({
    'string.base': 'uid must be of type string.',
    'any.required': 'uid is a required field.',
  }),
});
