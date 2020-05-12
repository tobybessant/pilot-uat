import * as jf from "joiful";
import { ICreateSuiteRequest } from "../../../../dto/request/supplier/createSuite";

export class CreateSuite implements ICreateSuiteRequest {

  @jf.string()
    .required()
  title!: string;

  @jf.string()
    .required()
  projectId!: string;
}