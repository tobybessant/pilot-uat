import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Delete, Get, Patch } from "@overnightjs/core";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { Request, Response } from "express";
import StepRepository from "../repositories/stepRepository";
import { IStepResponse } from "../dto/response/supplier/step";
import { BaseController } from "./baseController";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { Validator } from "joiful";
import { CreateStep } from "../services/middleware/joi/schemas/createStep";
import { ICreateStepRequest } from "../dto/request/supplier/createStep";
import { UpdateStep } from "../services/middleware/joi/schemas/updateStep";
import { IUpdateStepRequest } from "../dto/request/supplier/updateStep";
import { PermittedAccountTypes } from "../services/middleware/permittedAccountTypes";
import { BASE_ENDPOINT } from "./BASE_ENDPOINT";
import { StepFeedbackRepository } from "../repositories/stepFeedbackRepository";
import { IStepReponse } from "../dto/response/client/step.interface";
import StepStatusRepository from "../repositories/stepStatusRepository";
import { ApiError } from "../services/apiError";
import { BAD_REQUEST } from "http-status-codes";

@injectable()
@Controller(`${BASE_ENDPOINT}/steps`)
@ClassMiddleware(checkAuthentication)
export class StepController extends BaseController {

  constructor(private stepRepository: StepRepository,
    private stepStatusRepository: StepStatusRepository,
    private stepFeedbackRepository: StepFeedbackRepository) {
    super();
  }

  @Post()
  @Middleware(new BodyMatches(new Validator()).schema(CreateStep))
  public async addStepToCase(req: Request, res: Response) {
    const model: ICreateStepRequest = req.body;

    try {
      const step = await this.stepRepository.addStepForCase(model.description, model.caseId);

      this.OK<IStepResponse>(res, {
        id: step.id.toString(),
        description: step.description
      });
    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Get()
  public async getStepsForCase(req: Request, res: Response) {
    try {
      let steps = [];
      if (req.user?.type === "Supplier") {
        steps = await this.stepRepository.getStepsForCase(req.query.caseId);
        return this.OK<IStepResponse[]>(res, steps.map(step => ({
          description: step.description,
          id: step.id.toString()
        })));
      }

      steps = await this.stepRepository.getStepsForCase(req.query.caseId);
      const defaultStatus = await this.stepStatusRepository.getStatusByLabel("Not Started");
      if(!defaultStatus) {
        throw new ApiError("Broken!!", BAD_REQUEST);
      }

      const mappedSteps: IStepReponse[] = [];
      for (const step of steps) {
        const latestStepFeedback = await this.stepFeedbackRepository.getUserFeedbackForStep(step.id.toString(), req.user?.email || "");

        mappedSteps.push({
          id: step.id.toString(),
          description: step.description,
          currentStatus: {
            id: latestStepFeedback[0]?.status.id.toString() || defaultStatus.id.toString(),
            label: latestStepFeedback[0]?.status.label || defaultStatus.label
          }
        });
      }
      return this.OK<IStepReponse[]>(res, mappedSteps);
    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Patch(":id")
  @Middleware(new BodyMatches(new Validator()).schema(UpdateStep))
  public async updateStep(req: Request, res: Response) {
    const model: IUpdateStepRequest = req.body;

    try {
      const stepDbo = await this.stepRepository.getStepById(req.params.id);
      if (!stepDbo) {
        return this.badRequest(res, ["Error finding step"]);
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
        description: updateStep.description
      });
    } catch (error) {
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