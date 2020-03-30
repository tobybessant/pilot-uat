import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Delete } from "@overnightjs/core";
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
import { UpdateStep } from "../services/middleware/joi/schemas/updateStep";
import { IUpdateStepRequest } from "../dto/request/supplier/updateStep";
import { ApiError } from "../services/apiError";
import { BAD_REQUEST } from "http-status-codes";
import { PermittedAccountTypes } from "../services/middleware/permittedAccountTypes";

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
        description: step.description,
        status: {
          id: step.status.id.toString(),
          label: step.status.label
        }
      });
    } catch (error) {
      this.serverError(res, error);
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
        id: step.id.toString(),
        status: {
          id: step.status.id.toString(),
          label: step.status.label
        }
      })));
    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Post("update")
  @Middleware(new BodyMatches(new Validator()).schema(UpdateStep))
  public async updateStep(req: Request, res: Response) {
    const model: IUpdateStepRequest = req.body;

    try {
      const stepDbo = await this.stepRepository.getStepById(model.id);
      if (!stepDbo) {
        throw new ApiError("Error finding step", BAD_REQUEST);
      }

      // map model properties to step dbo
      for (const key of Object.keys(model)) {
        if (stepDbo.hasOwnProperty(key) && key !== "id") {
          (stepDbo as any)[key] = (model as any)[key];
        }
      }

      const updateStep = await this.stepRepository.updateStep(stepDbo);

      this.OK<IStepResponse>(res, {
        id: updateStep.id.toString(),
        description: updateStep.description,
        status: {
          id: updateStep.status.id.toString(),
          label: updateStep.status.label
        }
      });
    } catch (error) {
      if (error instanceof ApiError) {
        this.errorResponse(res, error.statusCode, [error.message]);
        return;
      }
      this.serverError(res, error);
    }
  }

  @Delete(":id")
  @Middleware(PermittedAccountTypes.are(["Supplier"]))
  public async deleteStep(req: Request, res: Response) {
    const stepId = req.params.id;

    try {
      const deletedStep = await this.stepRepository.deleteStepById(stepId);
      this.OK(res);
    } catch (error) {
      this.serverError(res, error);
    }
  }
}