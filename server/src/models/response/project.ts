import { ISuiteResponse } from "./suite";

export interface IProjectResponse {
  id: string;
  projectName: string;
  suites: ISuiteResponse[]
}