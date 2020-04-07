import { injectable } from "tsyringe";
import * as jwt from "jwt-simple";
import { IProjectInviteToken } from "../../dto/request/common/inviteToken";
import { ApiError } from "../apiError";
import { UNAUTHORIZED } from "http-status-codes";

@injectable()
export class JwtService {

  private readonly secret: string = process.env.JWT_SECRET || "shhh";
  private readonly EXPIRY_HOURS = 48;

  public encode(inviteData: IProjectInviteToken): string {
    return jwt.encode({
      ...inviteData,
      exp: Date.now() + (this.EXPIRY_HOURS * 60 * 60 * 1000)
    }, this.secret);
  }

  public decode(token: string): IProjectInviteToken {
    try {
      return jwt.decode(token, this.secret);
    } catch(error) {
      throw new ApiError(error.message, UNAUTHORIZED, true);
    }
  }
}
