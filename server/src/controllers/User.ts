import { OK } from "http-status-codes";
import { Request, Response } from "express";
import { Controller, ClassMiddleware, Get } from "@overnightjs/core";
import { checkAuthentication } from "../middleware/checkAuthentication";
import { injectable } from "tsyringe";

@injectable()
@Controller("user")
@ClassMiddleware(checkAuthentication)
export class UserController {

  @Get("account")
  private getAccountDetails(req: Request, res: Response) {
    res.status(OK).json({
      message: req.user
    });
  }
}