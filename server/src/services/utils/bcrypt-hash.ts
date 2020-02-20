import * as bcrypt from "bcrypt";

export class Bcrypt {
  private static readonly saltRounds = 10;

  static hash(password: string) {

    if(!password) {
      throw new Error("No password provided");
    }

    return bcrypt.hashSync(password, this.saltRounds);
  }

  static verify(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

}
