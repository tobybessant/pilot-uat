import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Delete, Get, ClassOptions } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";
import { TestSuiteRepository } from "../repositories/suiteRepository";
import { ProjectRepository } from "../repositories/projectRepository";
import { PermittedAccountTypes } from "../services/middleware/permittedAccountTypes";
import { ISuiteResponse } from "../dto/response/supplier/suite";
import { BaseController } from "./baseController";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { ICreateSuiteRequest } from "../dto/request/supplier/createSuite";
import { CreateSuite } from "../services/middleware/joi/schemas/createSuite";
import { Validator } from "joiful";
import { BASE_ENDPOINT } from "./BASE_ENDPOINT";

@injectable()
@Controller(`${BASE_ENDPOINT}/suites`)
@ClassOptions({ mergeParams: true })
@ClassMiddleware(checkAuthentication)
export class TestSuiteController extends BaseController {

  constructor(
    private testSuiteRepository: TestSuiteRepository,
    private projectsRepository: ProjectRepository
  ) {
    super();
  }

  @Post()
  @Middleware([
    new BodyMatches(new Validator()).schema(CreateSuite),
    PermittedAccountTypes.are(["Supplier"])
  ])
  public async createTestSuite(req: Request, res: Response) {
    const model: ICreateSuiteRequest = req.body;

    try {
      const project = await this.projectsRepository.getProjectById(model.projectId);
      if (!project) {
        return this.badRequest(res, ["Project does not exist"]);
      }

      const suite = await this.testSuiteRepository.addTestSuite(project, model.title);

      if (!suite) {
        return this.serviceUnavailable(res, ["Error adding suite"]);
      }

      this.OK<ISuiteResponse>(res, {
        title: suite.title,
        id: suite.id.toString()
      });

    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Get()
  public async getTestSuites(req: Request, res: Response) {
    try {
      const testSuites = await this.projectsRepository.getTestSuitesForProject(req.query.projectId);

      this.OK<ISuiteResponse[]>(res, testSuites.map(suite =>
        ({
          title: suite.title,
          id: suite.id.toString()
        })));
    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Delete(":suiteId")
  @Middleware(PermittedAccountTypes.are(["Supplier"]))
  public async deleteSuite(req: Request, res: Response) {
    try {
      const deletedSuite = await this.testSuiteRepository.deleteTestSuiteById(req.params.suiteId);
      this.OK(res);
    } catch (error) {
      this.serverError(res, error);
    }
  }
}
