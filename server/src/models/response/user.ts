import { UserTypeDbo } from "../../database/entities/userTypeDbo";
import { OrganisationDbo } from "../../database/entities/organisationDbo";

export interface IUserResponse {
  email: string;
  firstName: string;
  lastName: string;
  createdDate: Date;
  type: string;
  userType: UserTypeDbo,
  organisations: OrganisationDbo[]
}