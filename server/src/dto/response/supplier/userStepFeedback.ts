import { IStepFeedbackResponse } from "../client/feedback";

export interface IUserStepFeedbackResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdDate: Date;
  feedback: IStepFeedbackResponse[];
}
