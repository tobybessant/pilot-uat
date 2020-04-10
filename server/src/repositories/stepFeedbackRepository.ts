import { TypeORMRepository } from "./baseRepository.abstract";
import { StepFeedbackDbo } from "../database/entities/stepFeedbackDbo";
import { StepStatusDbo, StepStatus } from "../database/entities/stepStatusDbo";
import { RepositoryService } from "../services/repositoryService";
import { injectable } from "tsyringe";
import { StepDbo } from "../database/entities/stepDbo";
import { UserDbo } from "../database/entities/userDbo";
import { UserRepository } from "./userRepository";

@injectable()
export class StepFeedbackRepository extends TypeORMRepository<StepFeedbackDbo> {
  private baseStepStatusRepository: any;
  constructor(private repositoryService: RepositoryService, private userRepository: UserRepository) {
    super(StepFeedbackDbo, repositoryService);
    this.baseStepStatusRepository = repositoryService.getRepositoryFor(StepStatusDbo);
  }

  public async addStepFeedback(user: UserDbo, step: StepDbo, notes: string, statusLabel: string) {
    const status = await this.baseStepStatusRepository.findOne({ label: StepStatus.PASSED });
    return this.getBaseRepo().save({ notes, user, step, status });
  }

  public async getMostRecentStepFeedbackPerUser(stepId: string): Promise<UserDbo[] | undefined> {
    const feedbackPerUser = await this.userRepository.getBaseRepo()
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.stepFeedback", "feedback")
      .leftJoinAndSelect("feedback.status", "status")
      .leftJoin("feedback.step", "Step")
      .where("step.id = :id", { id: stepId })
      .orderBy("feedback.createdDate", "DESC")
      .getMany();

    return feedbackPerUser;
  }
}