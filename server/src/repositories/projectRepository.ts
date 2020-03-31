import { EntityRepository, Repository } from "typeorm";
import { UserDbo } from "../database/entities/userDbo";
import { injectable } from "tsyringe";
import { ProjectDbo } from "../database/entities/projectDbo";
import { UserProjectRoleDbo } from "../database/entities/userProjectRoleDbo";
import { RepositoryService } from "../services/repositoryService";
import { SuiteDbo } from "../database/entities/suiteDbo";
import { UserRepository } from "./userRepository";

@injectable()
@EntityRepository()
export class ProjectRepository {

  private baseProjectRepository: Repository<ProjectDbo>;
  private userProjectRoleRepository: Repository<UserProjectRoleDbo>;

  constructor(private repositoryService: RepositoryService, private userRepository: UserRepository) {
    this.baseProjectRepository = repositoryService.getRepositoryFor(ProjectDbo);
    this.userProjectRoleRepository = repositoryService.getRepositoryFor(UserProjectRoleDbo);
  }

  public async addProject(user: UserDbo, projectName: string): Promise<ProjectDbo> {
    // save new project
    const project = new ProjectDbo();
    project.organisation = user.organisations[0];
    project.title = projectName;
    project.suites = [];
    const savedProject = await this.baseProjectRepository.save(project);

    // save new relationship to user
    const userProjectRole = new UserProjectRoleDbo();
    userProjectRole.user = user;
    userProjectRole.project = savedProject;
    await this.userProjectRoleRepository.save(userProjectRole);

    return savedProject;
  }

  public async getProjectById(id: string): Promise<ProjectDbo | undefined> {
    const project: ProjectDbo | undefined = await this.baseProjectRepository.findOne({ id: Number(id) });
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
      id: Number(id)
    });
    return;
  }

  // TODO: Move this method into test suite repository
  public async getTestSuitesForProject(id: string): Promise<SuiteDbo[]> {
    const project = await this.baseProjectRepository
      .createQueryBuilder("project")
      .leftJoin("project.suites", "suites")
      .addSelect(["suites.title", "suites.id"])
      .where("project.id = :id", { id })
      .getOne();

    if (!project) {
      throw new Error("Project does not exist");
    }

    return project.suites || [];
  }

  public async addUserToProject(email: string, projectId: string) {
    const user = await this.userRepository.getUserByEmail(email);
    const project = await this.baseProjectRepository.findOne({ id: Number(projectId) });

    await this.userProjectRoleRepository.save({
      project,
      user
    });
  }

  public async removeUserFromProject(userId: string, projectId: string) {
    const user = await this.userRepository.getUserById(userId);
    const project = await this.baseProjectRepository.findOne({ id: Number(projectId) });

    return this.userProjectRoleRepository.delete({ user, project });
  }

  public async getUsersForProject(projectId: string) {
    const projectWithUsers = await this.baseProjectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.users", "userRoles")
      .leftJoinAndSelect("userRoles.user", "users")
      .leftJoinAndSelect("users.userType", "type")
      .where("project.id = :id", { id: projectId })
      .getOne();

    if (!projectWithUsers) {
      throw new Error("Project does not exist");
    }

    return projectWithUsers.users;
  }
}