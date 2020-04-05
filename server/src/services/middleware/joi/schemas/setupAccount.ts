import * as jf from "joiful";
import { ISetupAccountRequest } from "../../../../dto/request/common/setupAccount";

export class SetupAccount implements ISetupAccountRequest {
  @jf.string()
    .label("Token")
    .required()
  token!: string;

  @jf.string()
    .label("Password")
    .required()
  password!: string;

  @jf.string()
    .label("First Name")
    .required()
  firstName!: string;

  @jf.string()
    .label("Last Name")
    .required()
  lastName!: string;

}