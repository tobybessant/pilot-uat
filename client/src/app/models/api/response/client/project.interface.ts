import { ISuiteResponse } from "./suite.interface";

export interface IProjectResponse {
  id: string;
  title: string;
  suites: ISuiteResponse[];
}
