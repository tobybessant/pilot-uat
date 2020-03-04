import { Strategy } from "passport-local";
import { Repository, AdvancedConsoleLogger } from "typeorm";
import { injectable } from "tsyringe";

import { Bcrypt } from "../../utils/bcrypt-hash";
import { UserDbo } from "../../../database/entities/userDbo";
import { RepositoryService } from "../../repositoryservice";
import { IUserToken } from "../../../models/response/usertoken";

@injectable()
export class Local {

  private userRepository: Repository<UserDbo>;

  constructor(
    private repositoryService: RepositoryService,
    private bcrypt: Bcrypt
  ) {
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
  }

	public init (this: Local, _passport: any): any {
    const userRepository = this.userRepository;
    const bcrypt = this.bcrypt;

		_passport.use(new Strategy(
      {
        usernameField: "email"
      },
      async function(email, password, done) {
        // check for user & check password
        const user: UserDbo | undefined = await userRepository
          .createQueryBuilder("user")
          .addSelect("user.passwordHash")
          .leftJoinAndSelect("user.userType", "type")
          .where("user.email = :email", { email })
          .getOne();

        if (user && bcrypt.verify(password, user.passwordHash)) {
          const u: IUserToken = {
            email: user.email,
            type: user.userType.type
          }
          return done(null, u);
        }

        // wrong password
        return done(null, false);
      }
    ));
	}
}