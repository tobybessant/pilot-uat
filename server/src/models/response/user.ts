import { UserTypeDbo } from "../../database/entities/userTypeDbo";

export interface IUserResponse {
  email: string;
  firstName: string;
  lastName: string;
  createdDate: Date;
  type: string;
  userType: UserTypeDbo
}