import * as passport from "passport";
import { Repository } from "typeorm";
import { User } from "../../database/entity/User";
import { RepositoryService } from "../../database/repositories/repositoryservice";
import { Logger } from "@overnightjs/logger";
import { container, injectable } from "tsyringe";
import { Local } from "./strategies";
import { Application } from "express";

@injectable()
export class Passport {

  private userRepository: Repository<User>;

  constructor(
    private repositoryService: RepositoryService
  ) {
    this.userRepository = repositoryService.getRepositoryFor<User>(User);
  }

  public initialise(app: Application) {
    app.use(passport.initialize())
    app.use(passport.session())

    this.setupAuthStrategies();
  }

  private setupAuthStrategies(): void {
    Logger.Info("Loading auth strategies...");
    const userRepo = this.userRepository;

    passport.serializeUser(function (user: any, done) {
      done(null, user.email);
    });

    passport.deserializeUser(async function (email: string, done) {
      const user: User | undefined = await userRepo.findOne({ email });

      if (user) {
        delete user.passwordHash;
        delete user.id;
        done(null, user);
      }
    });

    const localStrategy = container.resolve<Local>(Local);
    localStrategy.init(passport);
  }

}