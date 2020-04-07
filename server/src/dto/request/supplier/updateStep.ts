import { IStepStatusRequest } from "./stepStatus";

export interface IUpdateStepRequest {
  description?: string;
  status?: Partial<IStepStatusRequest>;
}
