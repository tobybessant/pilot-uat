import { Request, Response } from "express";
import { Controller, Middleware, Get, Post } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as passport from "passport";
import { checkAuthentication } from "../middleware/checkAuthentication";
import { injectable, inject } from "tsyringe";
import { User } from "../database/entity/User";
import { RepositoryService } from "../database/repositories/repositoryservice";
import { Repository } from "typeorm";
import { Bcrypt } from "../services/utils/bcrypt-hash";

@injectable()
@Controller("auth")
export class AuthController {

  private userRepository: Repository<User>

  constructor(
    private repositoryService: RepositoryService
  ) {
    this.userRepository = repositoryService.getRepositoryFor<User>(User);
  }

  @Post("createaccount")
  private async createAccount(req: Request, res: Response) {

    // extract details and hash password
    const { email, password, firstName } = req.body;
    const passwordHash = Bcrypt.hash(password);

    // save user details to
    const user: User = await this.userRepository.save({ email, passwordHash, firstName });
    res.status(200).json({
      email
    });
  }

  @Post("login")
  @Middleware(passport.authenticate("local"))
  private login(req: Request, res: Response) {
    Logger.Info("Authenticated local");
    res.status(200).json({
      message: req.user
    });
  }

  @Get("logout")
  @Middleware(checkAuthentication)
  private logout(req: Request, res: Response) {
    Logger.Info("Logging out");
    req.logOut();

    res.status(200).json({
      message: "Logged out"
    });
  }
}