import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Get, Delete } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";
import { TestSuiteRepository } from "../repositories/testSuiteRepository";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from "http-status-codes";
import { ProjectRepository } from "../repositories/projectRepository";
import { IApiResponse } from "../dto/common/apiResponse";
import { PermittedAccountTypes } from "../services/middleware/permittedAccountTypes";
import { ISuiteResponse } from "../dto/supplier/testSuite";
import { SuiteDbo } from "../database/entities/suiteDbo";

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
    const { title, projectId } = req.body;

    try {
      const project = await this.projectsRepository.getProjectById(projectId);
      if (!project) {
        throw new Error("Project does not exist");
      }

      const suite = await this.testSuiteRepository.addTestSuite(project, title);

      if(!suite) {
        throw new Error("Failed to add suite");
      }

      res.status(OK);
      res.json({
        errors: [],
        payload: ((record: SuiteDbo): ISuiteResponse =>
        ({
          title: record.title,
          id: record.id
        })
      )(suite)
      } as IApiResponse<ISuiteResponse>);
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR);
      res.json({
        errors: [error.message]
      } as IApiResponse<any>);
    }
  }

  @Post("all")
  public async getTestSuites(req: Request, res: Response) {
    const { projectId } = req.body;

    try {
      const testSuites = await this.projectsRepository.getTestSuitesForProject(projectId);

      res.status(OK);
      res.json({
        errors: [],
        payload: testSuites.map(record =>
          ({
            title: record.title,
            id: record.id
          }))
      } as IApiResponse<ISuiteResponse[]>);
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR);
      res.json({
        errors: [error.message]
      } as IApiResponse<any>);
    }
  }

  @Delete(":id")
  @Middleware(PermittedAccountTypes.are(["Supplier"]))
  public async deleteSuite(req: Request, res: Response) {
    const suiteId = req.params.id;

    try {
      const deletedSuite = await this.testSuiteRepository.deleteTestSuiteById(suiteId);
      res.status(OK);
      res.json({
        errors: []
      } as unknown as IApiResponse<any>);
      return;

    } catch (error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<any>);
    }
  }
}
