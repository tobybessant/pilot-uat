import * as passport from "passport";
import { Repository } from "typeorm";
import { Logger } from "@overnightjs/logger";
import { container, injectable } from "tsyringe";
import { Local } from "./strategies";
import { Application } from "express";
import { UserDbo } from "../../database/entities/userDbo";
import { RepositoryService } from "../repositoryservice";

@injectable()
export class Passport {

  private userRepository: Repository<UserDbo>;

  constructor(
    private repositoryService: RepositoryService
  ) {
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
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
      const user: UserDbo | undefined = await userRepo.findOne({ email });

      if (user) {
        done(null, user);
      }
    });

    const localStrategy = container.resolve<Local>(Local);
    localStrategy.init(passport);
  }

}