import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Get } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";
import { TestSuiteRepository } from "../repositories/testSuiteRepository";
import { OK, BAD_REQUEST } from "http-status-codes";
import { ProjectRepository } from "../repositories/projectRepository";
import { IApiResponse } from "../models/response/apiResponse";
import { PermittedAccountTypes } from "../services/middleware/permittedAccountTypes";
import { ITestSuiteResponse } from "../models/response/testSuite";

@injectable()
@Controller("suite")
@ClassMiddleware(checkAuthentication)
export class TestSuiteController {

  constructor(
    private testSuiteRepository: TestSuiteRepository,
    private projectsRepository: ProjectRepository
  ) { }

  @Post("create")
  @Middleware(PermittedAccountTypes.are(["Supplier"]))
  public async createTestSuite(req: Request, res: Response) {
    const { suiteName, projectId } = req.body;

    try {
      const project = await this.projectsRepository.getProjectById(projectId);
      if (!project) {
        return;
      }

      await this.testSuiteRepository.addTestSuite(project, suiteName);

      res.status(OK);
      res.json({ suiteName });
    } catch (error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<any>);
    }
  }

  @Get("all")
  public async getTestSuites(req: Request, res: Response) {
    const { projectId } = req.body;

    try {
      const testSuites = await this.projectsRepository.getTestSuitesForProject(projectId);

      res.status(OK);
      res.json({
        errors: [],
        payload: testSuites.map(ts =>
          ({
            suiteName: ts.suiteName
          }))
      } as IApiResponse<ITestSuiteResponse[]>);
    } catch (error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<any>);
    }
  }

}
