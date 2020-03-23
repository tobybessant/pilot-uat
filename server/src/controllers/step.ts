import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";
import StepRepository from "../repositories/stepRepository";
import { IStepResponse } from "../dto/response/supplier/step";
import { BaseController } from "./baseController";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { Validator } from "joiful";
import { CreateStep } from "../services/middleware/joi/schemas/createStep";
import { ICreateStepRequest } from "../dto/request/supplier/createStep";
import { GetAllSteps } from "../services/middleware/joi/schemas/getAllSteps";
import { IGetAllStepsRequest } from "../dto/request/supplier/getAllSteps";

@injectable()
@Controller("step")
@ClassMiddleware(checkAuthentication)
export class StepController extends BaseController {

  constructor(private stepRepository: StepRepository) {
    super();
  }

  @Post("create")
  @Middleware(new BodyMatches(new Validator()).schema(CreateStep))
  public async addStepToCase(req: Request, res: Response) {
    const model: ICreateStepRequest = req.body;

    try {
      const step = await this.stepRepository.addStepForCase(model.description, model.caseId);

      this.OK<IStepResponse>(res, {
        id: step.id.toString(),
        description: step.description
      });
    } catch(error) {
      this.serverError(res);
    }
  }

  @Post("all")
  @Middleware(new BodyMatches(new Validator()).schema(GetAllSteps))
  public async getStepsForCase(req: Request, res: Response) {
    const model: IGetAllStepsRequest = req.body;

    try {
      const steps = await this.stepRepository.getStepsForCase(model.caseId);

      this.OK<IStepResponse[]>(res, steps.map(step => ({
          description: step.description,
          id: step.id.toString()
        }))
      )
    } catch(error) {
      this.serverError(res);
    }
  }
}