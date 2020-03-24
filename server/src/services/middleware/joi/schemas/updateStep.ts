import { IUpdateStepRequest } from "../../../../dto/request/supplier/updateStep";
import * as jf from "joiful";
import { IStepStatusResponse } from "../../../../dto/response/supplier/stepStatus";

// tslint:disable-next-line: max-classes-per-file
export class UpdateStep implements IUpdateStepRequest {

  @jf.string()
    .required()
  id!: string;

  @jf.string()
    .optional()
  description?: string | undefined;

  @jf.object()
    .optional()
  status?: IStepStatusResponse;

}