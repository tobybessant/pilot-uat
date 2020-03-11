import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";
import { TestSuiteRepository } from "../repositories/testSuiteRepository";
import { OK } from "http-status-codes";
import { ProjectRepository } from "../repositories/projectRepository";
import { IUserToken } from "../models/response/userToken";


@injectable()
@Controller("suite")
@ClassMiddleware(checkAuthentication)
export class TestSuiteController {

  constructor(
    private testSuiteRepository: TestSuiteRepository,
    private projectsRepository: ProjectRepository
  ) { }

  @Post("create")
  public async createTestSuite(req: Request, res: Response) {
    const { suiteName, projectId } = req.body;

    const project = await this.projectsRepository.getProjectById(projectId);

    if(project) {
      await this.testSuiteRepository.addTestSuite(project, suiteName);
    }

    res.status(OK);
    res.json({ suiteName });
  }

}
