import { BaseController } from "./baseController";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { IClientInviteRequest } from "../dto/request/supplier/clientInvite";
import { InviteService } from "../services/invite/inviteService";
import { ClientInvite } from "../services/middleware/joi/schemas/inviteClient";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { Validator } from "joiful";

@injectable()
@Controller("invite")
@ClassMiddleware(checkAuthentication)
export class InviteController extends BaseController {

  constructor(private inviteService: InviteService) {
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

}