import { IStepStatusResponse } from "../supplier/stepStatus";

export interface IStepReponseClient {
  id: string;
  description: string;
  status: IStepStatusResponse;
}