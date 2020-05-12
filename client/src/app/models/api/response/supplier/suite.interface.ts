import { ICaseResponse } from "./case.interface";

export interface ISuiteResponse {
  id: string;
  projectId: string;
  title: string;
  cases?: ICaseResponse;
}
