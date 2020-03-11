import { OK, BAD_REQUEST, CREATED } from "http-status-codes";
import { Request, Response } from "express";
import { Controller, Middleware, Get, Post } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as passport from "passport";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { BodyMatches } from "../services/middleware/bodyMatches";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { Bcrypt } from "../services/utils/bcryptHash";
import { ICreateUserRequest } from "../models/request/createUser";
import { ILoginRequest } from "../models/request/login";
import { IApiResponse } from "../models/response/apiResponse";
import { UserDbo } from "../database/entities/userDbo";
import { RepositoryService } from "../services/repositoryService";
import { UserTypeDbo } from "../database/entities/userTypeDbo";
import { IUserToken } from "../models/response/userToken";
import { ICreateUserResponse } from "../models/response/createUser";
import { OrganisationDbo } from "../database/entities/organisationDbo";

@injectable()
@Controller("auth")
export class AuthController {

  private userRepository: Repository<UserDbo>
  private userTypeRepository: Repository<UserTypeDbo>
  private organisationRepository: Repository<OrganisationDbo>;

  constructor(
    private repositoryService: RepositoryService,
    private bcrypt: Bcrypt
  ) {
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
    this.userTypeRepository = repositoryService.getRepositoryFor<UserTypeDbo>(UserTypeDbo);
    this.organisationRepository = repositoryService.getRepositoryFor<OrganisationDbo>(OrganisationDbo);
  }

  @Post("createaccount")
  @Middleware(BodyMatches.modelSchema(ICreateUserRequest))
  public async createAccount(req: Request, res: Response) {

    // extract details
    const { email, password, firstName, lastName, organisationName, type } = req.body;

    // save user details to database
    try {
      // query for existing user
      const exists: number = await this.userRepository.count({ email });
      if (exists) {
        throw new Error("Account already exists with that email");
      }

      // add organisation
      const organisation = await this.organisationRepository.save({ organisationName });

      // add user credentials
      const userType: UserTypeDbo | undefined = await this.userTypeRepository.findOne({ type });

      // hash password
      const passwordHash = this.bcrypt.hash(password);
      const user: UserDbo = await this.userRepository.save({
        email,
        passwordHash,
        firstName,
        lastName,
        userType,
        organisations: [ organisation ]
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
    BodyMatches.modelSchema(ILoginRequest),
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
