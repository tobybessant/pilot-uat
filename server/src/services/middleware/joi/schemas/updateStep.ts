import { IUpdateStepRequest } from "../../../../dto/request/supplier/updateStep";
import * as jf from "joiful";

export class UpdateStep implements IUpdateStepRequest {

  @jf.string()
    .required()
  id!: string;

  @jf.string()
    .required()
  description?: string | undefined;

}