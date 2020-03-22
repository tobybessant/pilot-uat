import * as jf from "joiful";
import { IGetProjectRequest } from "../../../../dto/request/supplier/getProject";

export class GetProject implements IGetProjectRequest {

  @jf.string()
    .required()
  id!: string;

}