import * as jf from "joiful";
import { ICreateUserRequest } from "../../../../dto/request/common/createUser";

export class CreateUser implements ICreateUserRequest {
  @jf.string()
    .label("First Name")
    .max(30)
    .required()
  firstName!: string;

  @jf.string()
    .label("Last Name")
    .max(30)
    .required()
  lastName!: string;

  @jf.string()
    .label("Organisation")
    .optional()
  organisationName!: string;

  @jf.string()
    .label("Email")
    .email()
    .required()
  email!: string;

  @jf.string()
    .label("Password")
    .min(8)
    .max(64)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .required()
  password!: string;

  @jf.string()
    .label("Type")
    .required()
  type!: string;

}
