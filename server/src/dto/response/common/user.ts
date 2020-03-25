import { IOrganisationResponse } from "./organisation";

export interface IUserResponse {
  email: string;
  firstName: string;
  lastName: string;
  createdDate: Date;
  type: string;
  organisations: IOrganisationResponse[]
}