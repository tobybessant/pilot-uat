import { IProjectInviteToken } from "./inviteToken";

export interface ISetupAccountRequest {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
}
