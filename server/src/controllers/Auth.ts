import { OK, BAD_REQUEST, CREATED } from "http-status-codes";
import { Request, Response } from "express";
import { Controller, Middleware, Get, Post } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as passport from "passport";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { Bcrypt } from "../services/utils/bcrypt-hash";
import { bodyDoesMatch } from "../services/middleware/bodyDoesMatch";
import { ICreateUserRequest } from "../models/request/createuser";
import { ILoginRequest } from "../models/request/login";
import { IApiResponse } from "../models/response/apiresponse";
import { UserDbo } from "../database/entities/userDbo";
import { RepositoryService } from "../services/repositoryservice";
import { UserTypeDbo } from "../database/entities/userTypeDbo";
import { IUserToken } from "../models/response/usertoken";
import { ICreateUserResponse } from "../models/response/createUser";

@injectable()
@Controller("auth")
export class AuthController {

  private userRepository: Repository<UserDbo>
  private userTypeRepository: Repository<UserTypeDbo>

  constructor(
    private repositoryService: RepositoryService,
  ) {
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
    this.userTypeRepository = repositoryService.getRepositoryFor<UserTypeDbo>(UserTypeDbo);
  }

  @Post("createaccount")
  @Middleware(bodyDoesMatch(ICreateUserRequest))
  public async createAccount(req: Request, res: Response) {

    // extract details and hash password
    const { email, password, firstName, lastName } = req.body;

    // hash password
    const passwordHash = Bcrypt.hash(password);

    // save user details to database
    try {
      // query for existing user
      const exists: number = await this.userRepository.count({ email });
      if (exists) {
        throw new Error("Account already exists with that email");
      }

      // add user credentials
      const userType: UserTypeDbo | undefined = await this.userTypeRepository.findOne({ type: "Client" });
      const user: UserDbo = await this.userRepository.save({
        email,
        passwordHash,
        firstName,
        lastName,
        userType
      });

      req.login(
        {
          email,
          type: userType?.type
        } as IUserToken,
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );

      res.status(CREATED);
      res.json({
        errors: [],
        payload: {
          email: user.email,
          firstName: user.firstName,
          type: userType?.type
        }
      } as IApiResponse<ICreateUserResponse>);
    } catch (error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<ICreateUserResponse>);
    }
  }

  @Post("login")
  @Middleware([
    bodyDoesMatch(ILoginRequest),
    passport.authenticate("local")
  ])
  public login(req: Request, res: Response) {
    res.status(OK);
    res.json({
      errors: [],
      payload: {
        ...req.user as any
      }
    } as IApiResponse<IUserToken>);
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