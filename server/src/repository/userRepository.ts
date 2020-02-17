import { BaseRepository } from './repository.abstract';
import { Connection } from 'typeorm';
import { User } from '../database/entity/user';

export class UserRepository extends BaseRepository<User> {
  constructor(connection: Connection, dbo: User) {
    super(connection, dbo);
  }
}