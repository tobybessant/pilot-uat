import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { SuiteDbo } from "../database/entities/suiteDbo";
import { RepositoryService } from "../services/repositoryService";
import { ProjectDbo } from "../database/entities/projectDbo";
import { CaseDbo } from "../database/entities/caseDbo";

@injectable()
@EntityRepository()
export class TestSuiteRepository {
  private baseTestSuiteRepository: Repository<SuiteDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseTestSuiteRepository = repositoryService.getRepositoryFor(SuiteDbo);
  }

  public async getTestSuiteById(id: string): Promise<SuiteDbo | undefined> {
    return this.baseTestSuiteRepository.findOne({ id });
  }

  public async addTestSuite(project: ProjectDbo, suiteName: string): Promise<SuiteDbo | undefined> {
    return this.baseTestSuiteRepository.save({
      project,
      suiteName
    });
  }

  public async deleteTestSuiteById(id: string) {
    await this.baseTestSuiteRepository.delete({ id });
    return;
  }
}