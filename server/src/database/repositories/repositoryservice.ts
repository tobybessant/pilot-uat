import { getRepository, Connection, ObjectLiteral, EntitySchema } from 'typeorm';
import { injectable } from 'tsyringe';

@injectable()
export class RepositoryService {

  public getRepositoryFor<T>(dbo: any) {
    return getRepository<T>(dbo);
  }
  
}