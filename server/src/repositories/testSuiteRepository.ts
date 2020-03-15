import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { TestSuiteDbo } from "../database/entities/testSuiteDbo";
import { RepositoryService } from "../services/repositoryService";
import { ProjectDbo } from "../database/entities/projectDbo";
import { TestDbo } from "../database/entities/testDbo";

@injectable()
@EntityRepository()
export class TestSuiteRepository {
  private baseTestSuiteRepository: Repository<TestSuiteDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseTestSuiteRepository = repositoryService.getRepositoryFor(TestSuiteDbo);
  }

  public async getTestSuiteById(id: string): Promise<TestSuiteDbo | undefined> {
    return this.baseTestSuiteRepository.findOne({ id });
  }

  public async addTestSuite(project: ProjectDbo, suiteName: string): Promise<TestSuiteDbo | undefined> {
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