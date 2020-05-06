import * as jf from "joiful";

export class LogIn {

  @jf.string()
    .label("Email")
    .email()
    .required()
  email!: string;

  @jf.string()
    .label("Password")
    .required()
  password!: string;

}