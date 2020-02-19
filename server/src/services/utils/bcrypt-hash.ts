import * as bcrypt from "bcrypt";

const saltRounds = 10;

export class Bcrypt {

  static hash(password: string) {
    return bcrypt.hashSync(password, saltRounds);
  }

  static verify(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

}
