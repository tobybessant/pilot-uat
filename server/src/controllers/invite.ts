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

@injectable()
@Controller("invite")
export class InviteController extends BaseController {

  constructor(
    private inviteService: InviteService,
    private userRepository: UserRepository
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

    // check token validity

    const existingAccount = await this.userRepository.accountDoesExist(invite.email);
    if (existingAccount) {
      res.redirect("accept/" + token);
      return;
    } else {
      // direct to password setup page
      res.redirect("setup/" + token);

      // add to project
      return;
    }
  }

  @Get("setup/:token")
  public async setupAndAcceptInvite(req: Request, res: Response): Promise<void> {
      const originalUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      res.redirect(`http://localhost:4200/setup?r=${encodeURIComponent(originalUrl)}`);
  }

  @Get("accept/:token")
  public async acceptInvite(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      const originalUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      console.log(originalUrl);
      res.redirect(`http://localhost:4200/login?r=${encodeURIComponent(originalUrl)}`);
      return;
    }

    res.send("Logged in, adding to project!");
  }

}