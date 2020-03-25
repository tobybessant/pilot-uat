import { IStepStatusResponse } from "./stepStatus";

export interface IStepResponse {
  id: string;
  description: string;
  status: IStepStatusResponse;
}