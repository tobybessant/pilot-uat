import { injectable } from "tsyringe";
import * as jwt from "jwt-simple";
import { IProjectInviteToken } from "../../dto/request/common/inviteToken";

@injectable()
export class JwtService {

  private readonly secret: string = process.env.JWT_SECRET || "shhh";

  public encode(inviteData: IProjectInviteToken): string {
    return jwt.encode(inviteData, this.secret);
  }

  public decode(token: string): IProjectInviteToken {
    return jwt.decode(token, this.secret);
  }
}
