import { ProjectInviteDbo } from "../database/entities/projectInviteDbo";
import { RepositoryService } from "../services/repositoryService";
import { Repository, EntityRepository } from "typeorm";
import { injectable } from "tsyringe";
import { TypeORMRepository } from "./baseRepository.abstract";

@injectable()
@EntityRepository()
export class ProjectInviteRepository extends TypeORMRepository<ProjectInviteDbo>{

  constructor(private repositoryService: RepositoryService) {
    super(ProjectInviteDbo, repositoryService);
  }

  public inviteAccepted(invite: ProjectInviteDbo) {
    invite.status = "Accepted";
    return this.getBaseRepo().save(invite);
  }

  public async getOpenInvitesForProject(projectId: string): Promise<ProjectInviteDbo[]> {
    return this.getBaseRepo().find({ projectId: Number(projectId), status: "Pending" });
  }

  public async getInviteById(inviteId: string): Promise<ProjectInviteDbo | undefined> {
    return this.getBaseRepo().findOne({ id: Number(inviteId) });
  }
}