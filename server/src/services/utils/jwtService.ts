import { injectable } from "tsyringe";
import * as jwt from "jwt-simple";

@injectable()
export class JwtService {

  private readonly secret: string = "secret!";

  public encode(payload: any): string {
    return jwt.encode(payload, this.secret);
  }

  public decode(token: string): any {
    return jwt.decode(token, this.secret);
  }
}
