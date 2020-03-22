import { IStepResponse } from "./step.interface";

export interface ICaseResponse {
  id: number;
  title: string;
  steps: IStepResponse[];
}
