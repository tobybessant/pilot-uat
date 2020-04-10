import { Post, Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import StepRepository from "../repositories/stepRepository";
import { StepFeedbackRepository } from "../repositories/stepFeedbackRepository";
import { ApiError } from "../services/apiError";
import { BAD_REQUEST } from "http-status-codes";
import { BaseController } from "./baseController";
import { injectable } from "tsyringe";
import { BASE_ENDPOINT } from "./BASE_ENDPOINT";

@injectable()
@Controller(`${BASE_ENDPOINT}/feedback`)
export class StepFeedbackController extends BaseController {

  constructor(
    private userRepository: UserRepository,
    private stepRepository: StepRepository,
    private stepFeedbackRepository: StepFeedbackRepository
  ) {
    super();
  }

  @Post()
  public async addStepFeedback(req: Request, res: Response) {

    try {
      const user = await this.userRepository.getUserByEmail(req.user?.email || "");
      if (!user) throw new ApiError("no user", BAD_REQUEST);

      const step = await this.stepRepository.getStepById(req.body.stepId);
      if (!step) throw new ApiError("no user", BAD_REQUEST);

      const addFeedback = await this.stepFeedbackRepository.addStepFeedback(user, step, req.body.notes, req.body.status);
      if(!addFeedback)
        throw new ApiError("feedback not found!", BAD_REQUEST);

      return this.created<any>(res, addFeedback);
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  @Get()
  public async getStepFeedback(req: Request, res: Response) {
    try {
      console.log(req.query);
      const feedback = await this.stepFeedbackRepository.getMostRecentStepFeedbackPerUser(req.query.stepId);
      console.log(feedback);

      return this.OK(res, feedback);
    } catch (error) {
      return this.serverError(res, error);
    }
  }
}