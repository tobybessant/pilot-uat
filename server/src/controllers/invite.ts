import { BaseController } from "./baseController";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Post, Middleware, Get } from "@overnightjs/core";
import { IClientInviteRequest } from "../dto/request/supplier/clientInvite";
import { InviteService } from "../services/invite/inviteService";
import { ClientInvite } from "../services/middleware/joi/schemas/inviteClient";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { Validator } from "joiful";
import { UserRepository } from "../repositories/userRepository";
import { ProjectRepository } from "../repositories/projectRepository";
import { Bcrypt } from "../services/utils/bcryptHash";
import { UserTypeRepository } from "../repositories/userTypeRepository";
import { BAD_REQUEST } from "http-status-codes";
import { ProjectInviteRepository } from "../repositories/projectInviteRepository";
import { ApiError } from "../services/apiError";
import { ISetupAccountRequest } from "../dto/request/common/setupAccount";
import { Logger } from "@overnightjs/logger";

@injectable()
@Controller("invite")
export class InviteController extends BaseController {

  private clientUrl = process.env.CLIENT_URL || "http://localhost:4200";

  constructor(
    private inviteService: InviteService,
    private projectInviteRepository: ProjectInviteRepository,
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository,
    private userTypeRepository: UserTypeRepository,
    private bcrypt: Bcrypt
  ) {
    super();
  }

  @Post("client")
  @Middleware([
    new BodyMatches(new Validator()).schema(ClientInvite)
  ])
  public async inviteClient(req: Request, res: Response): Promise<void> {
    const model: IClientInviteRequest = req.body;
    try {
      for (const email of model.emails) {
        const invite = await this.projectInviteRepository.baseRepo.save({
          userEmail: email,
          userType: "Client",
          projectId: Number(model.projectId)
        });

        await this.inviteService.inviteClient(email, invite.id.toString());
      }

      this.OK(res);
    } catch (error) {
      if (error instanceof ApiError) {
        this.errorResponse(res, error.statusCode, [error.message]);
        return;
      }
      this.serverError(res);
    }

  }

  @Get(":token")
  public async inviteResponse(req: Request, res: Response): Promise<void> {
    const token = req.params.token;

    // TODO: check token validity
    try {
      const decodedInvite = this.inviteService.decodeInviteToken(token);
      const invite = await this.projectInviteRepository.baseRepo.findOne({ id: Number(decodedInvite.id) });

      if (!invite) {
        throw new ApiError("Invite not found", BAD_REQUEST);
      }

      const existingAccount = await this.userRepository.accountDoesExist(invite.userEmail);
      if (existingAccount) {
        res.redirect("accept/" + token);
        return;
      }

      res.redirect(`${this.clientUrl}/setup?t=${encodeURIComponent(token)}`);
    } catch (error) {
      if (error instanceof ApiError) {
        this.errorResponse(res, error.statusCode, [error.message]);
        return;
      }
      this.serverError(res);
    }
  }

  @Post("setup")
  public async setupAndAccept(req: Request, res: Response): Promise<void> {
    const model: ISetupAccountRequest = req.body;

    try {
      const decodedInvite = this.inviteService.decodeInviteToken(model.token);
      const invite = await this.projectInviteRepository.baseRepo.findOne({ id: Number(decodedInvite.id) });

      if (!invite) {
        throw new ApiError("Invite not found", BAD_REQUEST);
      }

      const passwordHash = this.bcrypt.hash(model.password);

      const userType = await this.userTypeRepository.getTypeByType(invite.userType);
      if (!userType) {
      throw new ApiError("Invalid user type", BAD_REQUEST);
      }

      const user = await this.userRepository.baseRepo.save({
        userType,
        firstName: model.firstName,
        lastName: model.lastName,
        email: invite.userEmail,
        passwordHash
      });

      await this.projectRepository.addUserToProject(user.email, invite.projectId.toString());

      req.logIn({
        email: user.email,
        type: user.userType.type
      },
        function (err) {
          if (err) {
            Logger.Info(err);
          }
        }
      );

      await this.projectInviteRepository.inviteAccepted(invite);

      this.OK(res);
    } catch (error) {
      if (error instanceof ApiError) {
        this.errorResponse(res, error.statusCode, [error.message]);
        return;
      }
      this.serverError(res);
    }
  }

  @Get("accept/:token")
  public async acceptInvite(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      const originalUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      res.redirect(`${this.clientUrl}/login?r=${encodeURIComponent(originalUrl)}`);
      return;
    }

    try {
      const inviteId = this.inviteService.decodeInviteToken(req.params.token);
      const invite = await this.projectInviteRepository.baseRepo.save({ id: Number(inviteId) });

      await this.projectRepository.addUserToProject(invite.userEmail, invite.projectId.toString());

      res.redirect(`${this.clientUrl}/projects/${invite.projectId}`);
    } catch (error) {
      this.serverError(res, error);
    }
  }
}