import * as jf from "joiful";
import { ICreateCaseRequest } from "../../../../dto/request/supplier/createCase";

export class CreateCase implements ICreateCaseRequest {

  @jf.string()
    .label("Project ID")
    .required()
  projectId!: string;

  @jf.string()
    .label("Case Title")
    .max(30)
    .required()
  title!: string;

}