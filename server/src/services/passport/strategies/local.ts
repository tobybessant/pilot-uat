import { Logger } from "@overnightjs/logger";
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { injectable } from 'tsyringe';
import { User } from '../../../database/entity/User';
import { RepositoryService } from '../../../database/repositories/repositoryservice';
import { Bcrypt } from '../../utils/bcrypt-hash';

@injectable()
export class Local {
  
  private userRepository: Repository<User>;

  constructor(
    private repositoryService: RepositoryService
  ) {
    this.userRepository = repositoryService.getRepositoryFor<User>(User);
  }

	public init (this: Local, _passport: any): any {
    const userRepository = this.userRepository;

		_passport.use(new Strategy(
      {
        usernameField: "email"
      },
      async function(email, password, done) {

        // check for user & check password
        const user: User | undefined = await userRepository.findOne({ email });
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