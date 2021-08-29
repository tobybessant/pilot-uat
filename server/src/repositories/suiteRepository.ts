import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { SuiteDbo } from "../database/entities/suiteDbo";
import { RepositoryService } from "../services/repositoryService";
import { ProjectDbo } from "../database/entities/projectDbo";

@injectable()
@EntityRepository()
export class TestSuiteRepository {
  private baseTestSuiteRepository: Repository<SuiteDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseTestSuiteRepository = repositoryService.getRepositoryFor(SuiteDbo);
  }

  public async getTestSuiteById(id: string): Promise<SuiteDbo | undefined> {
    return this.baseTestSuiteRepository.findOne({ id: Number(id) });
  }

  public async addTestSuite(project: ProjectDbo, title: string): Promise<SuiteDbo> {
    return this.baseTestSuiteRepository.save({
      project,
      title
    });
  }

  public async deleteTestSuiteById(id: string) {
    await this.baseTestSuiteRepository.delete({ id: Number(id) });
    return;
  }
}