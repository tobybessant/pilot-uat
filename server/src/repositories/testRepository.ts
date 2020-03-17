import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { TestDbo } from "../database/entities/testDbo";
import { RepositoryService } from "../services/repositoryService";
import { TestSuiteDbo } from "../database/entities/testSuiteDbo";
import { TestStatusDbo } from "../database/entities/testStatusDbo";

@injectable()
@EntityRepository()
export class TestRepository {

  private baseTestRepository: Repository<TestDbo>;
  private baseTestStatusRepository: Repository<TestStatusDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseTestRepository = repositoryService.getRepositoryFor(TestDbo);
    this.baseTestStatusRepository = repositoryService.getRepositoryFor(TestStatusDbo);
  }

  public async addTest(suite: TestSuiteDbo, testCase: string): Promise<TestDbo> {
    const defaultStatus = await this.baseTestStatusRepository.findOne({ id: 1 });

    const response = await this.baseTestRepository.save({
      suite,
      testCase,
      status: defaultStatus
    });

    return response;
  }

  public async getTestsForTestSuite(id: string): Promise<TestDbo[]> {
    return this.baseTestRepository
      .createQueryBuilder("test")
      .leftJoinAndSelect("test.status", "status")
      .leftJoin("test.suite", "suite")
      .where("suite.id = :id", { id })
      .getMany();
  }

  public async deleteTestById(id: string) {
    return this.baseTestRepository.delete({ id });
  }

}