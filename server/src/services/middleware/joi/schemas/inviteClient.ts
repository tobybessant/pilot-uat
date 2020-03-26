import * as jf from "joiful";
import { IClientInviteRequest } from "../../../../dto/request/supplier/clientInvite";

export class ClientInvite implements IClientInviteRequest {

  @jf.array()
  .items(joi => joi.string().email())
  .label("Emails")
  .required()
  emails!: string[];

  @jf.string()
    .label("Project ID")
    .required()
  projectId!: string;

}