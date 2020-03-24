import { injectable } from "tsyringe";
import { RepositoryService } from "../services/repositoryService";
import { Repository } from "typeorm";
import { StepDbo } from "../database/entities/stepDbo";
import { CaseRepository } from "./caseRepository";
import { IUpdateStepRequest } from "../dto/request/supplier/updateStep";

@injectable()
export default class StepRepository {
  private baseStepRepository: Repository<StepDbo>;

  constructor(private respositoryService: RepositoryService, private caseRepository: CaseRepository) {
    this.baseStepRepository = respositoryService.getRepositoryFor(StepDbo);
  }

  public async addStepForCase(description: string, caseId: string) {
    const testCase = await this.caseRepository.getCaseById(caseId);
    return this.baseStepRepository.save({
      description,
      case: testCase
    });
  }

  public async getStepsForCase(id: string): Promise<StepDbo[]> {
    return this.baseStepRepository
      .createQueryBuilder("step")
      .leftJoin("step.case", "case")
      .where("case.id = :id", { id })
      .getMany();
  }

  public async updateStep(step: IUpdateStepRequest): Promise<StepDbo> {
    return this.baseStepRepository.save({ ...step, id: Number(step.id) });
  }
}