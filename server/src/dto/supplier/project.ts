import { ITestSuiteResponse } from "./testSuite";

export interface IProjectResponse {
  id: string;
  projectName: string;
  suites?: ITestSuiteResponse[]
}