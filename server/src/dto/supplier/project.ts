import { ISuiteResponse } from "./testSuite";

export interface IProjectResponse {
  id: string;
  title: string;
  suites?: ISuiteResponse[]
}