import { Repository, ObjectLiteral, Connection, EntitySchema } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  private repository: Repository<T>;

  constructor(connection: Connection) {
    const f: EntitySchema<T> = {} as EntitySchema<T>;
    this.repository = connection.getRepository<T>(f);
  }
}
