import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { TestSuiteDbo } from "../database/entities/testSuiteDbo";
import { RepositoryService } from "../services/repositoryService";
import { OrganisationDbo } from "../database/entities/organisationDbo";
import { ProjectDbo } from "../database/entities/projectDbo";

@injectable()
@EntityRepository()
export class TestSuiteRepository {
  private baseProjectRepository: Repository<TestSuiteDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseProjectRepository = repositoryService.getRepositoryFor(TestSuiteDbo);
  }

  public async addTestSuite(project: ProjectDbo, suiteName: string) {
    // const suite = new TestSuiteDbo();
    // suite.project = organisation;
    // suite.suiteName = suiteName;
    await this.baseProjectRepository.insert({
      project,
      suiteName
    });
  }
}