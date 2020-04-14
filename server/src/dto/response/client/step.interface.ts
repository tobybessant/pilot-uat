import { IStepStatusResponse } from "../supplier/stepStatus";

export interface IStepReponse {
  id: string;
  description: string;
  currentStatus: IStepStatusResponse;
}