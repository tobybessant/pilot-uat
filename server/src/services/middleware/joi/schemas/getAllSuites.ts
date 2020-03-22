import * as jf from "joiful";
import { IGetAllSuitesRequest } from "../../../../dto/request/supplier/getAllSuites";


export class GetAllSuites implements IGetAllSuitesRequest {

  @jf.string()
    .required()
  projectId!: string;

}