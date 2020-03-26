import { injectable } from "tsyringe";
import { EntityRepository, Repository } from "typeorm";
import { UserDbo } from "../database/entities/userDbo";
import { OrganisationDbo } from "../database/entities/organisationDbo";
import { RepositoryService } from "../services/repositoryService";

@injectable()
@EntityRepository()
export class UserRepository {
  private baseUserRepository: Repository<UserDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseUserRepository = this.repositoryService.getRepositoryFor(UserDbo);
  }

  public async accountDoesExist(email: string): Promise<boolean> {
    const recordCount = await this.baseUserRepository.count({ email });
    return recordCount === 1;
  }

  public async getUserByEmail(email: string): Promise<UserDbo | undefined> {
    return this.baseUserRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.userType", "type")
      .leftJoinAndSelect("user.organisations", "organisations")
      .where("user.email = :email", { email })
      .getOne();
  }

  public async getOrganisationsForUser(email: string): Promise<OrganisationDbo[] | undefined> {
    const user: UserDbo | undefined = await this.baseUserRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.organisations", "orgs")
      .where("user.email = :email", { email })
      .getOne();

    return user?.organisations;
  }
}