import { OK, BAD_REQUEST } from "http-status-codes";
import { Request, Response } from "express";
import { Controller, Middleware, Get, Post } from "@overnightjs/core";
import * as passport from "passport";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { Bcrypt } from "../services/utils/bcryptHash";
import { CreateUser } from "../services/middleware/joi/schemas/createUser";
import { UserDbo } from "../database/entities/userDbo";
import { RepositoryService } from "../services/repositoryService";
import { UserTypeDbo } from "../database/entities/userTypeDbo";
import { IUserToken } from "../dto/response/common/userToken";
import { OrganisationDbo } from "../database/entities/organisationDbo";
import { ICreateUserRequest } from "../dto/request/common/createUser";
import { BaseController } from "./baseController";
import { IUserResponse } from "../dto/response/common/user";
import { ApiError } from "../services/apiError";
import { Validator } from "joiful";
import { OrganisationRepository } from "../repositories/organisationRepository";

@injectable()
@Controller("auth")
export class AuthController extends BaseController {

  private userRepository: Repository<UserDbo>
  private userTypeRepository: Repository<UserTypeDbo>

  constructor(
    private repositoryService: RepositoryService,
    private organisationRepository: OrganisationRepository,
    private bcrypt: Bcrypt
  ) {
    super();
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
    this.userTypeRepository = repositoryService.getRepositoryFor<UserTypeDbo>(UserTypeDbo);
  }

  @Post("createaccount")
  @Middleware(new BodyMatches(new Validator()).schema(CreateUser))
  public async createAccount(req: Request, res: Response) {

    // extract details
    const model: ICreateUserRequest = req.body;

    // save user details to database
    try {
      // query for existing user
      const exists: number = await this.userRepository.count({ email: model.email });
      if (exists) {
        throw new ApiError("Account already exists with that email", BAD_REQUEST);
      }

      // add organisation if set
      const organisations = [];
      if (model.organisationName) {
        const newOrganisation = await this.organisationRepository.createOrganisation(model.organisationName);
        organisations.push(newOrganisation);
      }

      // add user credentials
      const userType: UserTypeDbo | undefined = await this.userTypeRepository.findOne({ type: model.type });

      // hash password
      const passwordHash = this.bcrypt.hash(model.password);
      const user: UserDbo = await this.userRepository.save({
        email: model.email,
        passwordHash,
        firstName: model.firstName,
        lastName: model.lastName,
        userType,
        organisations
      });

      req.login({
        email: model.email,
        type: user.userType.type
      },
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );

      this.created<IUserResponse>(res, {
        createdDate: user.createdDate,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.userType.type
      });

    } catch (error) {
      if (error instanceof ApiError) {
        this.errorResponse(res, error.statusCode, [error.message]);
      } else {
        this.serverError(res);
      }
    }
  }

  @Post("login")
  @Middleware([
    passport.authenticate("local")
  ])
  public login(req: Request, res: Response) {
    this.OK<IUserToken>(res, req.user);
  }

  @Get("logout")
  @Middleware(checkAuthentication)
  public logout(req: Request, res: Response) {
    req.logOut();
    res.status(OK)
    res.json({
      message: "Logged out"
    });
  }
}
