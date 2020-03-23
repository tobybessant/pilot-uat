import * as jf from "joiful";
import { ICreateStepRequest } from "../../../../dto/request/supplier/createStep";

export class CreateStep implements ICreateStepRequest {

  @jf.string()
    .label("Case ID")
    .required()
    caseId!: string;

  @jf.string()
    .label("Description")
    .required()
    description!: string;

}