import { getRepository, Connection, ObjectLiteral, EntitySchema, Repository } from "typeorm";
import { injectable } from "tsyringe";
import { MSSQLDatabase } from "../";

@injectable()
export class RepositoryService {

  constructor(
    public database: MSSQLDatabase
  ) { }

  public getRepositoryFor<T>(dbo: any): Repository<T> {
    return this.database.getConnection().getRepository<T>(dbo)
  }

}