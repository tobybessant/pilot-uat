import { UserTypeDbo } from "../database/entities/userTypeDbo";
import { EntityRepository } from "typeorm";
import { RepositoryService } from "../services/repositoryService";
import { TypeORMRepository } from "./baseRepository.abstract";
import { injectable } from "tsyringe";

@injectable()
@EntityRepository()
export class UserTypeRepository extends TypeORMRepository<UserTypeDbo> {

  constructor(private repositoryService: RepositoryService) {
    super(UserTypeDbo, repositoryService);
  }

  public async getTypeByType(type: string): Promise<UserTypeDbo | undefined> {
    return await this.getBaseRepo().findOne({ type });
  }
}