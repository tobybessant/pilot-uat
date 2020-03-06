import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { RepositoryService } from "../services/repositoryservice";
import { BodyMatches } from "../services/middleware/bodyMatches";
import { PermittedAccountTypes } from "../services/middleware/permittedAccountTypes";
import { ICreateProjectRequest } from "../models/request/createProject";
import { Repository } from "typeorm";
import { ProjectDbo } from "../database/entities/projectDbo";
import { UserDbo } from "../database/entities/userDbo";
import { OrganisationDbo } from "../database/entities/organisationDbo";
import { UserProjectRoleDbo } from "../database/entities/userProjectRole";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { IApiResponse } from "../models/response/apiresponse";
import { ICreateProjectResponse } from "../models/response/createProject";
import { IUserToken } from "../models/response/usertoken";
import { IProjectResponse } from "../models/response/project";

@injectable()
@Controller("project")
@ClassMiddleware(checkAuthentication)
export class ProjectController {

  private projectRepository: Repository<ProjectDbo>;
  private userRepository: Repository<UserDbo>;
  private organisationRepository: Repository<OrganisationDbo>;
  private userProjectRoleRepository: Repository<UserProjectRoleDbo>;

  constructor(
    private repositoryService: RepositoryService,
  ) {
    this.projectRepository = repositoryService.getRepositoryFor<ProjectDbo>(ProjectDbo);
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
    this.organisationRepository = repositoryService.getRepositoryFor<OrganisationDbo>(OrganisationDbo);
    this.userProjectRoleRepository = repositoryService.getRepositoryFor<UserProjectRoleDbo>(UserProjectRoleDbo);
  }

  @Post()
  @Middleware([
    BodyMatches.modelSchema(ICreateProjectRequest),
    PermittedAccountTypes.are(["Supplier"])
  ])
  public async createProject(req: Request, res: Response) {
    const { projectName } = req.body;

    try {
      const user: UserDbo | undefined = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.userType", "type")
        .leftJoinAndSelect("user.organisations", "organisations")
        .where("user.email = :email", { email: (req.user as IUserToken).email })
        .getOne();

      if (!user) {
        throw new Error("No user or organisation found.");
      }

      // save new project
      const project = new ProjectDbo();
      project.organisation = user.organisations[0];
      project.projectName = projectName;
      const savedProject = await this.projectRepository.save(project);

      // save new relationship to user
      const userProjectRole = new UserProjectRoleDbo();
      userProjectRole.user = user;
      userProjectRole.project = savedProject;
      const savedRole = await this.userProjectRoleRepository.save(userProjectRole);

      res.status(CREATED);
      res.json({
        errors: [],
        payload: {
          projectName: savedProject.projectName
        }
      } as IApiResponse<ICreateProjectResponse>);
    } catch (error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<ICreateProjectResponse>);
    }

  }

  @Get()
  public async getProjects(req: Request, res: Response) {

    try {
      const user = this.userRepository.findOne({ email: (req.user as IUserToken).email })
      const projects: ProjectDbo[] | undefined = await this.projectRepository
        .createQueryBuilder("project")
        .leftJoin("project.users", "userRoles")
        .leftJoin("userRoles.user", "user")
        .addSelect(["user.email", "user.firstName", "user.lastName"])
        .where("user.email = :email", { email: (req.user as IUserToken).email })
        .getMany();

      res.json({
        errors: [],
        payload: projects
      } as IApiResponse<IProjectResponse[]>);
      res.status(OK);
    } catch (error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<IProjectResponse>);
    }
  }
}