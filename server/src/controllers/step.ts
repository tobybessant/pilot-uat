import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Get } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";
import StepRepository from "../repositories/stepRepository";
import { OK } from "http-status-codes";
import { StepDbo } from "../database/entities/stepDbo";
import { IApiResponse } from "../dto/common/apiResponse";
import { IStepResponse } from "../dto/supplier/step";

@injectable()
@Controller("step")
@ClassMiddleware(checkAuthentication)
export class StepController {

  constructor(private stepRepository: StepRepository) {
  }

  @Post("create")
  public async addStepToCase(req: Request, res: Response) {
    const { description, caseId } = req.body;

    try {
      const step = await this.stepRepository.addStepForCase(description, caseId);

      res.status(OK);
      res.json({
        errors: [],
        payload: ((record: StepDbo) =>
          ({
            id: record.id,
            description: record.description
          })
        )(step)
      } as IApiResponse<IStepResponse>);
    } catch { }
  }

  @Post("all")
  public async getStepsForCase(req: Request, res: Response) {
    const { caseId } = req.body;

    try {
      const steps = await this.stepRepository.getStepsForCase(caseId);

      res.status(OK);
      res.json({
        errors: [],
        payload: steps.map(record =>
          ({
            description: record.description,
            id: record.id
          }))
      } as IApiResponse<IStepResponse[]>);
    } catch { }
  }
}