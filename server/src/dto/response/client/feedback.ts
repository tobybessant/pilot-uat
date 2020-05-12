import { IStepStatusResponse } from "../supplier/stepStatus";
import { IUserResponse } from "../common/user";

export interface IStepFeedbackResponse {
  createdDate: Date;
  id: string;
  notes: string;
  status: IStepStatusResponse;
  user?: IUserResponse;
}
