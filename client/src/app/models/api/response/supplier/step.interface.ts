import { IStepStatusResponse } from "./step-status.interface";

export interface IStepResponse {
  id: string;
  description: string;
  status: IStepStatusResponse;
}
