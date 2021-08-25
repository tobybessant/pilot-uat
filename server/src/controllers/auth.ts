import { Request, Response } from "express";
import { Controller, Middleware, Get, Post } from "@overnightjs/core";
import * as passport from "passport";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { injectable } from "tsyringe";
import { Bcrypt } from "../services/utils/bcryptHash";
import { CreateUser } from "../services/middleware/joi/schemas/createUser";
import { UserDbo } from "../database/entities/userDbo";
import { UserTypeDbo } from "../database/entities/userTypeDbo";
import { ICreateUserRequest } from "../dto/request/common/createUser";
import { BaseController } from "./baseController";
import { IUserResponse } from "../dto/response/common/user";
import { Validator } from "joiful";
import { OrganisationRepository } from "../repositories/organisationRepository";
import { UserRepository } from "../repositories/userRepository";
import { UserTypeRepository } from "../repositories/userTypeRepository";
import { BASE_ENDPOINT } from "./BASE_ENDPOINT";
import { ApiError } from "../services/apiError";
import { LogIn } from "../services/middleware/joi/schemas/login";
import { DemoAccountService } from "../services/utils/demoAccountService";

@injectable()
@Controller(`${BASE_ENDPOINT}/auth`)
export class AuthController extends BaseController {

  constructor(
    private userRepository: UserRepository,
    private userTypeRepository: UserTypeRepository,
    private organisationRepository: OrganisationRepository,
    private bcrypt: Bcrypt,
    private demoAccountService: DemoAccountService
  ) {
    super();
  }

  @Post("createaccount")
  @Middleware(new BodyMatches(new Validator()).schema(CreateUser))
  public async createAccount(req: Request, res: Response) {

    // extract details
    const model: ICreateUserRequest = req.body;

    // save user details to database
    try {
      // query for existing user
      const exists: boolean = await this.userRepository.accountDoesExist(model.email);
      if (exists) {
        return this.badRequest(res, ["Account already exists with that email"]);
      }

      // add organisation if set
      const organisations = [];
      if (model.organisationName) {
        const newOrganisation = await this.organisationRepository.createOrganisation(model.organisationName);
        organisations.push(newOrganisation);
      }

      // add user credentials
      const userType: UserTypeDbo | undefined = await this.userTypeRepository.getTypeByType(model.type);
      if (!userType) {
        return this.badRequest(res, ["Invalid user type"]);
      }

      // hash password
      const passwordHash = this.bcrypt.hash(model.password);
      const user: UserDbo = await this.userRepository.addUser({
        email: model.email,
        passwordHash,
        firstName: model.firstName,
        lastName: model.lastName,
        userType,
        organisations
      });

      if (model.demoAccount) {
        await this.demoAccountService.seedDemoAccountData(user.id);
      }

      req.login({
        email: model.email,
        type: user.userType.type
      },
        function (err) {
          if (err) {
            // console.log(err);
          }
        }
      );

      this.created<IUserResponse>(res, {
        id: user.id,
        createdDate: user.createdDate,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.userType.type
      });

    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Post("login")
  @Middleware(new BodyMatches(new Validator()).schema(LogIn))
  public login(req: Request, res: Response) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return this.serverError(res, new ApiError("Invalid email or password", 401));
      }
      req.login(user, () => {});
      return this.OK(res);
    })(req, res);
  }

  @Get("logout")
  @Middleware(checkAuthentication)
  public async logout(req: Request, res: Response) {
    req.logOut();
    req.user = undefined;
    return res.redirect("/");
  }
}
