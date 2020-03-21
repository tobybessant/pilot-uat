import { Controller, ClassMiddleware, Post, Delete } from "@overnightjs/core";
import { injectable } from "tsyringe";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { CaseRepository } from "../repositories/caseRepository";
import { Request, Response } from "express";
import { TestSuiteRepository } from "../repositories/suiteRepository";
import { CaseDbo } from "../database/entities/caseDbo";
import { ICaseResponse } from "../dto/supplier/case";
import { IApiResponse } from "../dto/common/apiResponse";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from "http-status-codes";

@injectable()
@Controller("case")
@ClassMiddleware(checkAuthentication)
export class TestController {
  constructor(
    private testRepository: CaseRepository,
    private suiteRepository: TestSuiteRepository
  ) { }


  @Post("create")
  public async addTest(req: Request, res: Response) {
    const { title, suiteId } = req.body;

    const suite = await this.suiteRepository.getTestSuiteById(suiteId);
    if (suite) {
      const test = await this.testRepository.addCase(suite, title);

      res.status(OK);
      res.json({
        errors: [],
        payload: ((record: CaseDbo) =>
          ({
            id: record.id,
            title: record.title
          })
        )(test)
      } as IApiResponse<ICaseResponse>);

    } else {
      res.status(INTERNAL_SERVER_ERROR);
      res.json({
        errors: ["Failure adding suite"],
      } as IApiResponse<ICaseResponse>);
    }
  }

  @Post()
  public async getTestsForSuite(req: Request, res: Response) {
    const { suiteId } = req.body;

    try {
      const tests = await this.testRepository.getCasesForTestSuite(suiteId);

      res.status(OK);
      res.json({
        errors: [],
        payload: tests!.map(t =>
          ({
            id: t.id,
            title: t.title
          }))
      } as IApiResponse<ICaseResponse[]>);
    } catch (error) { }
  }

  @Post("update")
  public async updateTest(req: Request, res: Response) {
    const test: ICaseResponse = req.body;

    try {
      const savedTest = await this.testRepository.updateCase(test);

      res.status(OK);
      res.json({
        errors: [],
        payload: ((record: CaseDbo) =>
          ({
            id: record.id,
            title: record.title
          })
        )(savedTest)
      } as IApiResponse<ICaseResponse>);
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
      await this.testRepository.deleteCaseById(testId);
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