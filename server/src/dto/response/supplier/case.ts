import { IStepResponse } from "./step";

export interface ICaseResponse {
  title: string;
  id: string;
  steps?: IStepResponse[];
}
