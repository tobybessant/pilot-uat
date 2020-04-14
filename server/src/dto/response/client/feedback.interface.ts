import { IStepStatusResponse } from "../supplier/stepStatus";
import { IUserResponse } from "../common/user";

export interface IStepFeedbackResponse {
  createdDate: Date;
  id: number;
  notes: string;
  status: IStepStatusResponse;
  user?: IUserResponse;
}
