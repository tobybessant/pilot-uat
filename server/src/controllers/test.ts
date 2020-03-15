import { Controller, ClassMiddleware, Post } from "@overnightjs/core";
import { injectable } from "tsyringe";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { TestRepository } from "../repositories/testRepository";
import { Request, Response } from "express";
import { TestSuiteRepository } from "../repositories/testSuiteRepository";

@injectable()
@Controller("test")
@ClassMiddleware(checkAuthentication)
export class TestController {
  constructor(
    private testRepository: TestRepository,
    private suiteRepository: TestSuiteRepository
  ) { }


  @Post("create")
  public async addTest(req: Request, res: Response) {
    const { testName, suiteId } = req.body;

    const suite = await this.suiteRepository.getTestSuiteById(suiteId);
    if(suite) {
      const response = await this.testRepository.addTest(suite, testName);
      res.json(response).status(200);
    } else {
      res.status(500).send("Failure");
    }
  }
}
