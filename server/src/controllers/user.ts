import { OK, BAD_REQUEST } from "http-status-codes";
import { Request, Response } from "express";
import { Controller, ClassMiddleware, Get } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { UserDbo } from "../database/entities/userDbo";
import { RepositoryService } from "../services/repositoryService";
import { IApiResponse } from "../models/response/apiResponse";
import { IUserResponse } from "../models/response/user";

@injectable()
@Controller("user")
@ClassMiddleware(checkAuthentication)
export class UserController {

  private userRepository: Repository<UserDbo>;

  constructor(
    private repositoryService: RepositoryService,
  ) {
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
  }

  @Get("account")
  public async getAccountDetails(req: Request, res: Response) {
    try {
      const { email } = req.user as any;
      const user: UserDbo | undefined = await this.userRepository
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.userType", "type")
          .leftJoinAndSelect("user.organisations", "organisations")
          .where("user.email = :email", { email })
          .getOne();

      res.status(OK)
      res.json({
        errors: [],
        payload: user
      } as IApiResponse<IUserResponse>);
    } catch (error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<IUserResponse>);
    }
  }
}
