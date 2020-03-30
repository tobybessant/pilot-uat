import { BaseController } from "./baseController";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Post, Middleware, Get, Delete } from "@overnightjs/core";
import { IClientInviteRequest } from "../dto/request/supplier/clientInvite";
import { InviteService } from "../services/invite/inviteService";
import { ClientInvite } from "../services/middleware/joi/schemas/inviteClient";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { Validator } from "joiful";
import { UserRepository } from "../repositories/userRepository";
import { ProjectRepository } from "../repositories/projectRepository";
import { Bcrypt } from "../services/utils/bcryptHash";
import { UserTypeRepository } from "../repositories/userTypeRepository";
import { ProjectInviteRepository } from "../repositories/projectInviteRepository";
import { ISetupAccountRequest } from "../dto/request/common/setupAccount";
import { Logger } from "@overnightjs/logger";

@injectable()
@Controller("invite")
export class InviteController extends BaseController {

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
      return this.serverError(res);
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
        return this.badRequest(res, ["Invite does not exist"]);
      }

      const existingAccount = await this.userRepository.accountDoesExist(invite.userEmail);
      if (existingAccount) {
        res.redirect("accept/" + token);
        return;
      }

      res.redirect(`${this.clientUrl}/setup?t=${encodeURIComponent(token)}`);
    } catch (error) {
      return this.serverError(res);
    }
  }

  @Post("setup")
  public async setupAndAccept(req: Request, res: Response): Promise<void> {
    const model: ISetupAccountRequest = req.body;

    try {
      const decodedInvite = this.inviteService.decodeInviteToken(model.token);
      const invite = await this.projectInviteRepository.baseRepo.findOne({ id: Number(decodedInvite.id) });

      if (!invite) {
        return this.badRequest(res, ["Invite does not exist"]);
      }

      const passwordHash = this.bcrypt.hash(model.password);

      const userType = await this.userTypeRepository.getTypeByType(invite.userType);
      if (!userType) {
        return this.badRequest(res, ["Invalid user type"]);
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
      return this.serverError(res, error);
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
      return this.serverError(res, error);
    }
  }

  @Get("resend/:id")
  public async resendInvite(req: Request, res: Response): Promise<void> {
    try {
      const invite = await this.projectInviteRepository.getInviteById(req.params.id);

      if (!invite) {
        return this.badRequest(res, ["Invite does not exist"]);
      }

      if (invite.status === "Accepted") {
        return this.badRequest(res, ["Invite has already been accepted"]);
      }

      await this.inviteService.inviteClient(invite.userEmail, invite.id.toString());
      return this.OK(res);

    } catch (error) {
      return this.serverError(res, error);
    }
  }

  @Delete(":id")
  public async deleteInvite(req: Request, res: Response): Promise<void> {
    try {
      const deletedInvite = await this.projectInviteRepository.baseRepo.delete({ id: Number(req.params.id) });
      this.OK(res);
    } catch (error) {
      this.serverError(res, error);
    }
  }
}