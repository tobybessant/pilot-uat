import { IStepStatusRequest } from "./stepStatus";

export interface IUpdateStepRequest {
  id: string;
  description?: string;
  status?: Partial<IStepStatusRequest>;
}
