import { StepStatus } from "../../../database/entities/stepStatusDbo";

export interface IStepStatusResponse {
  id: string;
  label: StepStatus;
}