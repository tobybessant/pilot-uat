import * as jf from "joiful";
import { IGetAllStepsRequest } from "../../../../dto/request/supplier/getAllSteps";


export class GetAllSteps implements IGetAllStepsRequest {

  @jf.string()
    .label("Case ID")
    .required()
  caseId!: string;

}