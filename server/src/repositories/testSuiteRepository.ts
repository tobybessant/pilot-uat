import { injectable } from "tsyringe";
import { EntityRepository } from "typeorm";

@injectable()
@EntityRepository()
export class TestSuiteRepository {
  
}