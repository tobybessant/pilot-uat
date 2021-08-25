import { Repository, AbstractRepository, ObjectType } from "typeorm";
import { injectable } from "tsyringe";
import { Database } from "../database";

@injectable()
export class RepositoryService {

  constructor(
    public database: Database
  ) { }

  public getRepositoryFor<T>(dbo: any): Repository<T> {
    return this.database.getConnection().getRepository<T>(dbo);
  }

  public getCustomRepositoryFor<T>(customRepository: ObjectType<T>): T {
    return this.database.getConnection().getCustomRepository<T>(customRepository);
  }

}
