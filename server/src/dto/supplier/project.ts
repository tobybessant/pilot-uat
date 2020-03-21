import { ITestSuiteResponse } from "./testSuite";

export interface IProjectResponse {
  id: string;
  title: string;
  suites?: ITestSuiteResponse[]
}