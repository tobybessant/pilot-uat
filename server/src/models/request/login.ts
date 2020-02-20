import * as joi from "joi";

export const ILoginRequest = joi.object({
  email: joi
    .string()
    .email()
    .required(),

  password: joi
    .string()
    .required(),
});