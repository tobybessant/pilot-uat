import { IStepResponse } from "../supplier/step.interface";

export interface IUserStepFeedback {
  createdDate: Date;
  id: number;
  notes: string;
  status: { label: string, id: string };
  step: IStepResponse;
}

export interface ILatestStepFeedbackMap {
  [idx: string]: IUserStepFeedback;
}

export interface IResultsMatrixData {
  id: string;
  createdDate: Date;
  email: string;
  firstName: string;
  lastName: string;
  feedback: ILatestStepFeedbackMap;
}
