import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { CaseDbo } from "../database/entities/caseDbo";
import { RepositoryService } from "../services/repositoryService";
import { SuiteDbo } from "../database/entities/suiteDbo";
import { ICaseResponse } from "../dto/response/supplier/case";

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
      .where("suite.id = :id", { id })
      .getMany();
  }

  public async deleteCaseById(id: string) {
    return this.baseCaseRepository.delete({ id });
  }

  public async updateCase(test: ICaseResponse): Promise<CaseDbo> {
    return this.baseCaseRepository.save({
      id: test.id,
      title: test.title
    });
  }

  public async getCaseById(id: string): Promise<CaseDbo | undefined> {
    return this.baseCaseRepository.findOne({ id });
  }

}