import * as joi from "joi";

export const ICreateUserRequest = joi.object({
  email: joi
    .string()
    .email()
    .required(),

  password: joi
    .string()
    .required(),

  firstName: joi
    .string()
    .max(30)
    .required()
});