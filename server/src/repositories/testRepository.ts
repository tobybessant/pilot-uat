import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { TestDbo } from "../database/entities/testDbo";
import { RepositoryService } from "../services/repositoryService";
import { TestSuiteDbo } from "../database/entities/testSuiteDbo";

@injectable()
@EntityRepository()
export class TestRepository {

  private baseTestRepository: Repository<TestDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseTestRepository = repositoryService.getRepositoryFor(TestDbo);
  }

  public async addTest(suite: TestSuiteDbo, subject: string): Promise<TestDbo> {
    const response = await this.baseTestRepository.save({
      suite,
      subject
    });

    return response;
  }

  public async getTestsForTestSuite(id: string): Promise<TestDbo[]> {
    return this.baseTestRepository
      .createQueryBuilder("tests")
      .leftJoin("tests.suite", "suite")
      .where("suite.id = :id", { id })
      .getMany();
  }
}