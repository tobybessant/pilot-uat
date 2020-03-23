import { IStepResponse } from "./step.interface";

export interface ICaseResponse {
  id: string;
  title: string;
  steps: IStepResponse[];
}
