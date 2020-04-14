import { injectable } from "tsyringe";
import { RepositoryService } from "../services/repositoryService";
import { Repository } from "typeorm";
import { StepDbo } from "../database/entities/stepDbo";
import { CaseRepository } from "./caseRepository";
import { StepStatusDbo, StepStatus } from "../database/entities/stepStatusDbo";

@injectable()
export default class StepStatusRepository {
  private baseStepStatusRepository: Repository<StepStatusDbo>;

  constructor(private respositoryService: RepositoryService, private caseRepository: CaseRepository) {
    this.baseStepStatusRepository = respositoryService.getRepositoryFor(StepStatusDbo);
  }

  public async getStatusByLabel(label: string): Promise<StepStatusDbo | undefined> {
    return this.baseStepStatusRepository
      .createQueryBuilder("step")
      .where("label = :label", {label})
      .getOne();
  }
}
