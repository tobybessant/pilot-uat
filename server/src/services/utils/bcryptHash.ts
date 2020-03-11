import * as bcrypt from "bcrypt";
import { injectable } from "tsyringe";

@injectable()
export class Bcrypt {
  private static readonly saltRounds = 10;

  hash(password: string) {

    if(!password) {
      throw new Error("No password provided");
    }

    return bcrypt.hashSync(password, Bcrypt.saltRounds);
  }

  verify(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

}
