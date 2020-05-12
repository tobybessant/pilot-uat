import { ISuiteResponse } from "./suite";

export interface IProjectResponse {
  id: string;
  title: string;
  suites?: ISuiteResponse[];
}