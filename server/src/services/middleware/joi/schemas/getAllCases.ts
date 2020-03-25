import * as jf from "joiful";
import { IGetAllCasesRequest } from "../../../../dto/request/supplier/getAllCases";


export class GetAllCases implements IGetAllCasesRequest {

  @jf.string()
    .label("Suite ID")
    .required()
  suiteId!: string;

}