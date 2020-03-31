import { injectable } from "tsyringe";
import { EntityRepository } from "typeorm";
import { UserDbo } from "../database/entities/userDbo";
import { OrganisationDbo } from "../database/entities/organisationDbo";
import { RepositoryService } from "../services/repositoryService";
import { TypeORMRepository } from "./baseRepository.abstract";

@injectable()
@EntityRepository()
export class UserRepository extends TypeORMRepository<UserDbo> {

  constructor(private repositoryService: RepositoryService) {
    super(UserDbo, repositoryService);
  }

  public async accountDoesExist(email: string): Promise<boolean> {
    const recordCount = await this.getBaseRepo().count({ email });
    return recordCount === 1;
  }

  public async getUserById(id: string): Promise<UserDbo | undefined> {
    return this.getBaseRepo().createQueryBuilder("user")
      .leftJoinAndSelect("user.userType", "type")
      .leftJoinAndSelect("user.organisations", "organisations")
      .where("user.id = :id", { id })
      .getOne();
  }

  public async getUserByEmail(email: string): Promise<UserDbo | undefined> {
    return this.getBaseRepo().createQueryBuilder("user")
      .leftJoinAndSelect("user.userType", "type")
      .leftJoinAndSelect("user.organisations", "organisations")
      .where("user.email = :email", { email })
      .getOne();
  }

  public async getOrganisationsForUser(email: string): Promise<OrganisationDbo[] | undefined> {
    const user: UserDbo | undefined = await this.getBaseRepo()
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.organisations", "orgs")
      .where("user.email = :email", { email })
      .getOne();

    return user?.organisations;
  }

  public async addUser(user: Partial<UserDbo>): Promise<UserDbo> {
    return this.getBaseRepo().save(user);
  }
}