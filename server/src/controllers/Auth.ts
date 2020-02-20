import { OK, BAD_REQUEST } from "http-status-codes";
import { Request, Response } from "express";
import { Controller, Middleware, Get, Post } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as passport from "passport";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { injectable } from "tsyringe";
import { UserDbo } from "../database/entity/User";
import { RepositoryService } from "../database/repositories/repositoryservice";
import { Repository } from "typeorm";
import { Bcrypt } from "../services/utils/bcrypt-hash";
import { bodyDoesMatch } from "../services/middleware/bodyDoesMatch";
import { ICreateUserRequest } from "../models/request/createuser";
import { ILoginRequest } from "../models/request/login";

@injectable()
@Controller("auth")
export class AuthController {

  private userRepository: Repository<UserDbo>

  constructor(
    private repositoryService: RepositoryService,
  ) {
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
  }

  @Post("createaccount")
  @Middleware(bodyDoesMatch(ICreateUserRequest))
  public async createAccount(req: Request, res: Response) {

    // extract details and hash password
    const { email, password, firstName } = JSON.parse(req.requestModel!);

    // hash password
    const passwordHash = Bcrypt.hash(password);

    // save user details to database
    try {
      // query for existing user
      const exists: number = await this.userRepository.count({ email });
      if(exists) {
        throw new Error("Account already exists with that email");
      }

      // add user credentials
      const user: UserDbo = await this.userRepository.save({ email, passwordHash, firstName });

      res.status(OK);
      res.json({
        email
      });
    } catch (error) {
      res.status(BAD_REQUEST);
      res.json({ error: error.message });
    }
  }

  @Post("login")
  @Middleware([
    bodyDoesMatch(ILoginRequest),
    passport.authenticate("local")
  ])
  public login(req: Request, res: Response) {
    Logger.Info("Authenticated local");
    res.status(OK);
    res.json({
      message: req.user
    });
  }

  @Get("logout")
  @Middleware(checkAuthentication)
  public logout(req: Request, res: Response) {
    Logger.Info("Logging out");
    req.logOut();

    res.status(OK)
    res.json({
      message: "Logged out"
    });
  }
}