import { injectable } from "tsyringe";
import { EntityRepository } from "typeorm";
import { RepositoryService } from "../services/repositoryService";
import { OrganisationDbo } from "../database/entities/organisationDbo";
import { TypeORMRepository } from "./baseRepository.abstract";

@injectable()
@EntityRepository()
export class OrganisationRepository extends TypeORMRepository<OrganisationDbo> {

  constructor(private repositoryService: RepositoryService) {
    super(OrganisationDbo, repositoryService);
  }

  public async createOrganisation(organisationName: string): Promise<OrganisationDbo> {
    return this.baseRepo.save({
      organisationName
    });
  }

}
