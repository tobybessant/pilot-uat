import { RepositoryService } from "../services/repositoryService";
import { Repository } from "typeorm";

export abstract class TypeORMRepository<T> {

  public readonly baseRepo: Repository<T>;

  constructor(model: any, repositoryService: RepositoryService) {
    this.baseRepo = repositoryService.getRepositoryFor(model);
  }
}