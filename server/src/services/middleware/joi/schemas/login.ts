import * as joi from "joi";

export const LoginSchema = joi.object({
  email: joi
    .string()
    .label("Email")
    .email()
    .required(),

  password: joi
    .string()
    .label("Password")
    .required(),
});