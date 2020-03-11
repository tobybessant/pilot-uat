import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { TestSuiteDbo } from "../database/entities/testSuiteDbo";
import { RepositoryService } from "../services/repositoryService";
import { ProjectDbo } from "../database/entities/projectDbo";

@injectable()
@EntityRepository()
export class TestSuiteRepository {
  private baseTestSuiteRepository: Repository<TestSuiteDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseTestSuiteRepository = repositoryService.getRepositoryFor(TestSuiteDbo);
  }

  public async addTestSuite(project: ProjectDbo, suiteName: string): Promise<TestSuiteDbo | undefined> {
    return await this.baseTestSuiteRepository.save({
      project,
      suiteName
    });
  }
}