import { EntityRepository, Repository } from "typeorm";
import { UserDbo } from "../database/entities/userDbo";
import { injectable } from "tsyringe";
import { ProjectDbo } from "../database/entities/projectDbo";
import { UserProjectRoleDbo } from "../database/entities/userProjectRole";
import { RepositoryService } from "../services/repositoryService";
import { TestSuiteDbo } from "../database/entities/testSuiteDbo";

@injectable()
@EntityRepository()
export class ProjectRepository {

  private baseProjectRepository: Repository<ProjectDbo>;
  private userProjectRoleRepository: Repository<UserProjectRoleDbo>;

  constructor(private repositoryService: RepositoryService) {
    this.baseProjectRepository = repositoryService.getRepositoryFor(ProjectDbo);
    this.userProjectRoleRepository = repositoryService.getRepositoryFor(UserProjectRoleDbo);
  }

  public async addProject(user: UserDbo, projectName: string) {
    // save new project
    const project = new ProjectDbo();
    project.organisation = user.organisations[0];
    project.projectName = projectName;
    const savedProject = await this.baseProjectRepository.save(project);

    // save new relationship to user
    const userProjectRole = new UserProjectRoleDbo();
    userProjectRole.user = user;
    userProjectRole.project = savedProject;
    await this.userProjectRoleRepository.save(userProjectRole);
  }

  public async getProjectById(id: string): Promise<ProjectDbo | undefined> {
    const project: ProjectDbo | undefined = await this.baseProjectRepository.findOne({ id });
    return project;
  }

  public async getProjectsForUser(email: string): Promise<ProjectDbo[] | undefined> {
    const projects: ProjectDbo[] | undefined = await this.baseProjectRepository
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
    const deletedProject = await this.baseProjectRepository.delete({
      id
    });
   return;
  }

  public async getTestSuitesForProject(id: string): Promise<TestSuiteDbo[]> {
    const project = await this.baseProjectRepository
      .createQueryBuilder("project")
      .leftJoin("project.testSuites", "suites")
      .addSelect("suites.suiteName")
      .where("project.id = :id", { id })
      .getOne();

    return project ? project.testSuites : [];
  }
}