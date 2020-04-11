import { IStepStatusResponse } from "../response/supplier/stepStatus";

export interface IStepReponseClient {
  id: string;
  description: string;
  status: IStepStatusResponse;
}