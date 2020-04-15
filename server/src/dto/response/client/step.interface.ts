import { IStepStatusResponse } from "../supplier/stepStatus";

export interface IStepResponse {
  id: string;
  description: string;
  currentStatus: IStepStatusResponse;
}