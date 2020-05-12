import * as jf from "joiful";
import { ICreateCaseRequest } from "../../../../dto/request/supplier/createCase";

export class CreateCase implements ICreateCaseRequest {

  @jf.string()
    .label("Suite ID")
    .required()
  suiteId!: string;

  @jf.string()
    .label("Case Title")
    .max(255)
    .required()
  title!: string;

}