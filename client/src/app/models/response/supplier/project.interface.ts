import { ITestSuiteResponse } from "./suite.interface";

export interface IProjectResponse {
  id: number;
  projectName: string;
  suites: ITestSuiteResponse[];
}
