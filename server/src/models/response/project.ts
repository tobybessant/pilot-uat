import { IUserResponse } from "./user";

export interface IProjectResponse {
  id: string;
  projectName: string;
  users: IUserResponse[]
}