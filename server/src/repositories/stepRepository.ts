import { injectable } from "tsyringe";
import { RepositoryService } from "../services/repositoryService";
import { Repository } from "typeorm";
import { StepDbo } from "../database/entities/stepDbo";
import { CaseRepository } from "./caseRepository";
import { IUpdateStepRequest } from "../dto/request/supplier/updateStep";
import { StepStatusDbo, StepStatus } from "../database/entities/stepStatusDbo";

@injectable()
export default class StepRepository {
  private baseStepRepository: Repository<StepDbo>;
  private baseStepStatusRepository: Repository<StepStatusDbo>;

  constructor(private respositoryService: RepositoryService, private caseRepository: CaseRepository) {
    this.baseStepRepository = respositoryService.getRepositoryFor(StepDbo);
    this.baseStepStatusRepository = respositoryService.getRepositoryFor(StepStatusDbo);
  }

  public async addStepForCase(description: string, caseId: string) {
    const testCase = await this.caseRepository.getCaseById(caseId);
    const defaultStatus = await this.baseStepStatusRepository.findOne({ label: StepStatus.NOT_STARTED });

    return this.baseStepRepository.save({
      description,
      case: testCase,
      status: defaultStatus
    });
  }

  public async getStepsForCase(id: string): Promise<StepDbo[]> {
    return this.baseStepRepository
      .createQueryBuilder("step")
      .leftJoin("step.case", "case")
      .leftJoinAndSelect("step.status", "status")
      .where("case.id = :id", { id })
      .getMany();
  }

  public async updateStep(step: IUpdateStepRequest): Promise<StepDbo> {
    const stepFormatted: any = {
      id: Number(step.id)
    };

    if (step.description) {
      stepFormatted.description = step.description
    }

    if (step.status) {
      const status = await this.baseStepStatusRepository.findOne(step.status as any);
      stepFormatted.status = status;
    }

    return this.baseStepRepository.save(stepFormatted);
  }
}