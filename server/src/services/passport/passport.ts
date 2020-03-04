import * as passport from "passport";
import { Repository } from "typeorm";
import { Logger } from "@overnightjs/logger";
import { container, injectable } from "tsyringe";
import { Local } from "./strategies";
import { Application } from "express";
import { UserDbo } from "../../database/entities/userDbo";
import { RepositoryService } from "../repositoryservice";
import { IUserToken } from "../../models/response/usertoken";

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

    passport.serializeUser(function (user: IUserToken, done) {
      done(null, user);
    });

    passport.deserializeUser(async function (user: IUserToken, done) {
      done(null, user);
    });

    const localStrategy = container.resolve<Local>(Local);
    localStrategy.init(passport);
  }

}