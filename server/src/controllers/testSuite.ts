import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";


@injectable()
@Controller("suite")
@ClassMiddleware(checkAuthentication)
export class TestSuiteController {

  constructor() {

  }

  @Post("create")
  public async createSuite(req: Request, res: Response) {
    const { suiteName } = req.body;
  }

}
