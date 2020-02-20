import { Strategy } from "passport-local";
import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { UserDbo } from "../../../database/entity/User";
import { RepositoryService } from "../../../database/repositories/repositoryservice";
import { Bcrypt } from "../../utils/bcrypt-hash";

@injectable()
export class Local {

  private userRepository: Repository<UserDbo>;

  constructor(
    private repositoryService: RepositoryService
  ) {
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
  }

	public init (this: Local, _passport: any): any {
    const userRepository = this.userRepository;

		_passport.use(new Strategy(
      {
        usernameField: "email"
      },
      async function(email, password, done) {

        // check for user & check password
        const user: UserDbo | undefined = await userRepository.findOne({ email });
        if (user && Bcrypt.verify(password, user.passwordHash)) {
          delete user.passwordHash;
          return done(null, user);
        }

        // wrong password
        return done(null, false);
      }
    ));
	}
}