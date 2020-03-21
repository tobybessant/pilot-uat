import { ISuiteResponse } from "./suite.interface";

export interface IProjectResponse {
  id: number;
  title: string;
  suites: ISuiteResponse[];
}
