import { EntityRepository, Repository, EntityManager } from "typeorm";
import { UserDbo } from "../database/entities/userDbo";
import { RepositoryService } from "../services/repositoryservice";
import { IUserResponse } from "../models/response/user";
import { injectable } from "tsyringe";
import { ProjectDbo } from "../database/entities/projectDbo";
import { UserProjectRoleDbo } from "../database/entities/userProjectRole";

@injectable()
@EntityRepository()
export class ProjectRepository {

  private projectRepository: Repository<ProjectDbo>;
  private userProjectRoleRepository: Repository<UserProjectRoleDbo>;

  constructor(private manager: EntityManager) {
    this.projectRepository = manager.getRepository(ProjectDbo);
    this.userProjectRoleRepository = manager.getRepository(UserProjectRoleDbo);
  }

  public async addProject(user: UserDbo, projectName: string) {
    // save new project
    const project = new ProjectDbo();
    project.organisation = user.organisations[0];
    project.projectName = projectName;
    const savedProject = await this.projectRepository.save(project);

    // save new relationship to user
    const userProjectRole = new UserProjectRoleDbo();
    userProjectRole.user = user;
    userProjectRole.project = savedProject;
    await this.userProjectRoleRepository.save(userProjectRole);
  }

  public async getProjectsforUser(email: string): Promise<ProjectDbo[] | undefined> {
    const projects: ProjectDbo[] | undefined = await this.projectRepository
    .createQueryBuilder("project")
    .orderBy("project.createdDate", "DESC")
    .leftJoin("project.users", "userRoles")
    .leftJoin("userRoles.user", "user")
    .addSelect(["user.email", "user.firstName", "user.lastName"])
    .where("user.email = :email", { email })
    .getMany();

    return projects;
  }

  public async deleteProjectById(id: string) {
    const deletedProject = await this.projectRepository.delete({
      id
    });

    if(deletedProject.affected === 1) {
      return;
    } else {
      throw new Error("Error in record deletion");
    }
  }
}