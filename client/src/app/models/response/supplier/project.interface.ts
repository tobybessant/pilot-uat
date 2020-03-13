import { ISuiteResponse } from "./suite.interface";

export interface IProjectResponse {
  id: number;
  projectName: string;
  suites: ISuiteResponse[];
}
