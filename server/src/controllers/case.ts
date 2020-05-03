import { Controller, ClassMiddleware, Post, Delete, Middleware, Get, Patch } from "@overnightjs/core";
import { injectable } from "tsyringe";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { CaseRepository } from "../repositories/caseRepository";
import { Request, Response } from "express";
import { TestSuiteRepository } from "../repositories/suiteRepository";
import { ICaseResponse } from "../dto/response/supplier/case";
import { BaseController } from "./baseController";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { Validator } from "joiful";
import { CreateCase } from "../services/middleware/joi/schemas/createCase";
import { UpdateCase } from "../services/middleware/joi/schemas/updateCase";
import { IUpdateCaseRequest } from "../dto/request/supplier/updateCase";
import { ICreateCaseRequest } from "../dto/request/supplier/createCase";
import { BASE_ENDPOINT } from "./BASE_ENDPOINT";

@injectable()
@Controller(`${BASE_ENDPOINT}/cases`)
@ClassMiddleware(checkAuthentication)
export class CaseController extends BaseController {
  constructor(
    private caseRepository: CaseRepository,
    private suiteRepository: TestSuiteRepository
  ) {
    super();
  }

  @Post()
  @Middleware([
    new BodyMatches(new Validator()).schema(CreateCase)
  ])
  public async addCase(req: Request, res: Response) {
    const model: ICreateCaseRequest = req.body;

    try {
      const suite = await this.suiteRepository.getTestSuiteById(model.suiteId);
      if (!suite) {
        return this.badRequest(res, ["Suite not found"]);
      }

      const test = await this.caseRepository.addCase(suite, model.title);

      this.created<ICaseResponse>(res, {
        id: test.id.toString(),
        title: test.title
      });
    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Get()
  public async getCasesForSuite(req: Request, res: Response) {
    try {
      const tests = await this.caseRepository.getCasesForTestSuite(req.query.suiteId);

      this.OK<ICaseResponse[]>(res, tests.map(t =>
        ({
          id: t.id.toString(),
          title: t.title
        }))
      );
    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Get(":caseId")
  public async getCaseById(req: Request, res: Response) {
    try {
      const caseData = await this.caseRepository.getCaseById(req.params.caseId);

      if (!caseData) {
        return this.badRequest(res, ["Case not found"]);
      }

      return this.OK<ICaseResponse>(res, {
        id: caseData.id.toString(),
        title: caseData.title,
        steps: caseData.steps.map(s => ({
          id: s.id.toString(),
          description: s.description
        }))
      });
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  @Patch(":id")
  @Middleware([
    new BodyMatches(new Validator()).schema(UpdateCase)
  ])
  public async updateCase(req: Request, res: Response) {
    const model: IUpdateCaseRequest = req.body;
    try {
      const savedTest = await this.caseRepository.updateCase(req.params.id, model);

      return this.OK<ICaseResponse>(res, {
        id: savedTest.id.toString(),
        title: savedTest.title
      });
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  @Delete(":id")
  public async deleteCaseById(req: Request, res: Response) {
    const testId = req.params.id;

    try {
      await this.caseRepository.deleteCaseById(testId);
      this.OK(res);
    } catch (error) {
      this.serverError(res, error);
    }
  }
}