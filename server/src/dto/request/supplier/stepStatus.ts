import { StepStatus } from "../../../database/entities/stepStatusDbo";

export interface IStepStatusRequest {
  id: string;
  label: StepStatus;
}
