import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Get, Delete } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";
import { TestSuiteRepository } from "../repositories/suiteRepository";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from "http-status-codes";
import { ProjectRepository } from "../repositories/projectRepository";
import { IApiResponse } from "../dto/common/apiResponse";
import { PermittedAccountTypes } from "../services/middleware/permittedAccountTypes";
import { ISuiteResponse } from "../dto/supplier/suite";
import { SuiteDbo } from "../database/entities/suiteDbo";
import { BaseController } from "./baseController";
import { ApiError } from "../services/apiError";

@injectable()
@Controller("suite")
@ClassMiddleware(checkAuthentication)
export class TestSuiteController extends BaseController {

  constructor(
    private testSuiteRepository: TestSuiteRepository,
    private projectsRepository: ProjectRepository
  ) {
    super();
  }

  @Post("create")
  @Middleware(PermittedAccountTypes.are(["Supplier"]))
  public async createTestSuite(req: Request, res: Response) {
    const { title, projectId } = req.body;

    try {
      const project = await this.projectsRepository.getProjectById(projectId);
      if (!project) {
        throw new ApiError("Project does not exist", BAD_REQUEST);
      }

      const suite = await this.testSuiteRepository.addTestSuite(project, title);

      if (!suite) {
        throw new ApiError("Failed to add suite", INTERNAL_SERVER_ERROR);
      }

      this.OK<ISuiteResponse>(res, {
        title: suite.title,
        id: suite.id
      });

    } catch (error) {
      if (error instanceof ApiError) {
        this.errorResponse(res, error.statusCode, [error.message]);
      } else {
        this.serverError(res);
      }
    }
  }

  @Post("all")
  public async getTestSuites(req: Request, res: Response) {
    const { projectId } = req.body;

    try {
      const testSuites = await this.projectsRepository.getTestSuitesForProject(projectId);

      this.OK<ISuiteResponse[]>(res, testSuites.map(suite =>
        ({
          title: suite.title,
          id: suite.id
        })))
    } catch (error) {
      this.serverError(res);
    }
  }

  @Delete(":id")
  @Middleware(PermittedAccountTypes.are(["Supplier"]))
  public async deleteSuite(req: Request, res: Response) {
    const suiteId = req.params.id;

    try {
      const deletedSuite = await this.testSuiteRepository.deleteTestSuiteById(suiteId);
      this.OK(res);
    } catch (error) {
      this.serverError(res);
    }
  }
}
