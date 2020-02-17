import * as bcrypt from "bcrypt";

export class Bcrypt {
  private readonly saltRounds = 10;
  
  private hash(password: string) {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  private verify(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
