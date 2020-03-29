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
import { OK } from "http-status-codes";

@injectable()
@Controller("invite")
export class InviteController extends BaseController {

  private clientUrl = process.env.CLIENT_URL || "http://localhost:4200";

  constructor(
    private inviteService: InviteService,
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

    this.inviteService.inviteClient(model.projectId, model.emails);

    this.OK(res);
  }

  @Get(":token")
  public async inviteResponse(req: Request, res: Response): Promise<void> {
    const token = req.params.token;
    const invite = this.inviteService.decodeInviteToken(token);

    // TODO: check token validity

    const existingAccount = await this.userRepository.accountDoesExist(invite.email);
    if (existingAccount) {
      res.redirect("accept/" + token);
      return;
    }

    res.redirect(`${this.clientUrl}/setup?t=${encodeURIComponent(token)}`);
  }

  @Post("setup")
  public async setupAndAccept(req: Request, res: Response): Promise<void> {
    const model = req.body;

    const invite = this.inviteService.decodeInviteToken(model.token);
    try {
      const passwordHash = this.bcrypt.hash(model.password);

      const userType = await this.userTypeRepository.getTypeByType(invite.type);
      if (!userType) {
        throw new Error("Invalid user type");
      }

      const user = await this.userRepository.baseRepo.save({
        userType,
        firstName: model.firstName,
        lastName: model.lastName,
        email: invite.email,
        passwordHash
      });

      await this.projectRepository.addUserToProject(user.email, invite.projectId);

      req.logIn({
        email: user.email,
        type: user.userType.type
      },
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );

      this.OK(res);
    } catch (error) {
      this.serverError(res, error);
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
      const invite = this.inviteService.decodeInviteToken(req.params.token);
      await this.projectRepository.addUserToProject(invite.email, invite.projectId);

      res.redirect(`${this.clientUrl}/projects/${invite.projectId}`);
    } catch (error) {
      this.serverError(res, error);
    }
  }

}