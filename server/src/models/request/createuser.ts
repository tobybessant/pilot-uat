import * as joi from "joi";

export const ICreateUserRequest = joi.object({
  firstName: joi
    .string()
    .label("First Name")
    .max(30)
    .required(),

  lastName: joi
    .string()
    .label("Last Name")
    .max(30)
    .required(),

  organisationName: joi
    .string()
    .label("Organisation")
    .required(),

  email: joi
    .string()
    .label("Email")
    .email()
    .required(),

  password: joi
    .string()
    .label("Password")
    .required(),

  type: joi
    .string()
    .required()
});