import { UserProjectRoleDbo } from "../database/entities/userProjectRole";
import { injectable } from "tsyringe";
import { EntityRepository, Repository, EntityManager } from "typeorm";
import { UserDbo } from "../database/entities/userDbo";

@injectable()
@EntityRepository()
export class UserRepository {

  private baseUserRepository: Repository<UserDbo>;

  constructor(private manager: EntityManager) {
    this.baseUserRepository = manager.getRepository(UserDbo);
  }

  public async getUserByEmail(email: string): Promise<UserDbo | undefined> {
    return this.baseUserRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.userType", "type")
        .leftJoinAndSelect("user.organisations", "organisations")
        .where("user.email = :email", { email })
        .getOne();
  }
}