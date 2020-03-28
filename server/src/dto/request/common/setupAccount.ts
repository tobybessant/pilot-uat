import { IProjectInviteToken } from "./inviteToken";

export interface ISetupAccountRequest {
  token: IProjectInviteToken;
  password: string;
  firstName: string;
  lastName: string;
}
