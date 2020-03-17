import { Controller, ClassMiddleware, Post, Delete } from "@overnightjs/core";
import { injectable } from "tsyringe";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { TestRepository } from "../repositories/testRepository";
import { Request, Response } from "express";
import { TestSuiteRepository } from "../repositories/testSuiteRepository";
import { TestDbo } from "../database/entities/testDbo";
import { ITestResponse } from "../dto/supplier/test";
import { IApiResponse } from "../dto/common/apiResponse";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from "http-status-codes";

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
    const { testCase, suiteId } = req.body;

    const suite = await this.suiteRepository.getTestSuiteById(suiteId);
    if (suite) {
      const test = await this.testRepository.addTest(suite, testCase);

      res.status(OK);
      res.json({
        errors: [],
        payload: ((record: TestDbo) =>
          ({
            id: record.id,
            testCase: record.testCase,
            status: record.status.status
          })
        )(test)
      } as IApiResponse<ITestResponse>);

    } else {
      res.status(INTERNAL_SERVER_ERROR);
      res.json({
        errors: ["Failure adding suite"],
      } as IApiResponse<ITestResponse>);
    }
  }

  @Post()
  public async getTestsForSuite(req: Request, res: Response) {
    const { suiteId } = req.body;

    try {
      const tests = await this.testRepository.getTestsForTestSuite(suiteId);

      res.status(OK);
      res.json({
        errors: [],
        payload: tests!.map(t =>
          ({
            id: t.id,
            testCase: t.testCase,
            status: t.status.status
          }))
      } as IApiResponse<ITestResponse[]>);
    } catch (error) { }
  }

  @Post("update")
  public async updateTest(req: Request, res: Response) {
    const test: ITestResponse = req.body;

    try {
      const savedTest = await this.testRepository.updateTest(test);

      res.status(OK);
      res.json({
        errors: [],
        payload: ((record: TestDbo) =>
          ({
            id: record.id,
            testCase: record.testCase,
            status: record.status.status
          })
        )(savedTest)
      } as IApiResponse<ITestResponse>);
    } catch(error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<any>);
    }
  }

  @Delete(":id")
  public async deleteTestById(req: Request, res: Response) {
    const testId = req.params.id;

    try {
      await this.testRepository.deleteTestById(testId);
      res.status(OK);
      res.json({
        errors: []
      } as unknown as IApiResponse<any>);
    } catch(error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<any>);
    }
  }
}