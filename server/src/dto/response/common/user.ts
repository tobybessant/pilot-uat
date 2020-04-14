import { IOrganisationResponse } from "./organisation";

export interface IUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdDate: Date;
  type?: string;
}