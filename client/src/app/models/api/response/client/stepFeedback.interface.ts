import { IStepStatusResponse } from "./step-status.interface";
import { IUserResponse } from "../common/user.interface";

export interface IStepFeedbackResponse {
  createdDate: Date;
  id: string;
  notes: string;
  status: IStepStatusResponse;
  user?: IUserResponse;
}
