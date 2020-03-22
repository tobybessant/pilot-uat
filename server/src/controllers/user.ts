import { OK, BAD_REQUEST } from "http-status-codes";
import { Request, Response } from "express";
import { Controller, ClassMiddleware, Get } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { UserDbo } from "../database/entities/userDbo";
import { RepositoryService } from "../services/repositoryService";
import { IApiResponse } from "../dto/common/apiResponse";
import { IUserResponse } from "../dto/common/user";
import { BaseController } from "./baseController";
import { ApiError } from "../services/apiError";

@injectable()
@Controller("user")
@ClassMiddleware(checkAuthentication)
export class UserController extends BaseController {

  private userRepository: Repository<UserDbo>;

  constructor(
    private repositoryService: RepositoryService,
  ) {
    super();
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

      if(!user) {
        throw new ApiError("User could not be found", BAD_REQUEST);
      }

      this.OK<IUserResponse>(res, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdDate: user.createdDate,
        organisations: user.organisations,
        type: user.userType.type
      });

    } catch (error) {
      if(error instanceof ApiError) {
        this.errorResponse(res, error.statusCode, [ error.message ]);
      } else {
        this.serverError(res);
      }
    }
  }
}
