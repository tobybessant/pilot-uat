import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Get } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";
import StepRepository from "../repositories/stepRepository";
import { OK } from "http-status-codes";
import { StepDbo } from "../database/entities/stepDbo";
import { IApiResponse } from "../dto/response/common/apiResponse";
import { IStepResponse } from "../dto/response/supplier/step";
import { BaseController } from "./baseController";

@injectable()
@Controller("step")
@ClassMiddleware(checkAuthentication)
export class StepController extends BaseController {

  constructor(private stepRepository: StepRepository) {
    super();
  }

  @Post("create")
  public async addStepToCase(req: Request, res: Response) {
    const { description, caseId } = req.body;

    try {
      const step = await this.stepRepository.addStepForCase(description, caseId);

      this.OK<IStepResponse>(res, {
        id: step.id,
        description: step.description
      });
    } catch(error) {
      this.serverError(res);
    }
  }

  @Post("all")
  public async getStepsForCase(req: Request, res: Response) {
    const { caseId } = req.body;

    try {
      const steps = await this.stepRepository.getStepsForCase(caseId);

      this.OK<IStepResponse[]>(res, steps.map(step => ({
          description: step.description,
          id: step.id
        }))
      )
    } catch(error) {
      this.serverError(res);
    }
  }
}