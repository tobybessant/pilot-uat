import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { CaseDbo } from "../database/entities/caseDbo";
import { RepositoryService } from "../services/repositoryService";
import { SuiteDbo } from "../database/entities/suiteDbo";
import { IUpdateCaseRequest } from "../dto/request/supplier/updateCase";

@injectable()
@EntityRepository()
export class CaseRepository {

  private baseCaseRepository: Repository<CaseDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseCaseRepository = repositoryService.getRepositoryFor(CaseDbo);
  }

  public async addCase(suite: SuiteDbo, title: string): Promise<CaseDbo> {
    const response = await this.baseCaseRepository.save({
      suite,
      title
    });

    return response;
  }

  public async getCasesForTestSuite(id: string): Promise<CaseDbo[]> {
    return this.baseCaseRepository
      .createQueryBuilder("case")
      .leftJoin("case.suite", "suite")
      .where("suite.id = :id", { id: Number(id) })
      .getMany();
  }

  public async deleteCaseById(id: string) {
    return this.baseCaseRepository.delete({ id: Number(id) });
  }

  public async updateCase(id: string, testCase: IUpdateCaseRequest): Promise<CaseDbo> {
    // convert the id key into a number
    return this.baseCaseRepository.save({ ...testCase, id: Number(id) });
  }

  public async getCaseById(id: string): Promise<CaseDbo | undefined> {
    const query = this.baseCaseRepository
      .createQueryBuilder("case")
      .leftJoinAndSelect("case.steps", "steps")
      .where("case.id = :id", { id });

    return query.getOne();
  }

}