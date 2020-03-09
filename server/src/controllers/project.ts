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
import { ProjectRepository } from "../repositories/project.repository";

@injectable()
@Controller("project")
@ClassMiddleware(checkAuthentication)
export class ProjectController {

  private projectRepository: ProjectRepository;
  private userRepository: Repository<UserDbo>;

  constructor(
    private repositoryService: RepositoryService,
  ) {
    this.projectRepository = repositoryService.getCustomRepositoryFor(ProjectRepository);
    this.userRepository = repositoryService.getRepositoryFor<UserDbo>(UserDbo);
  }

  @Post()
  @Middleware([
    BodyMatches.modelSchema(ICreateProjectRequest),
    PermittedAccountTypes.are(["Supplier"])
  ])
  public async createProject(req: Request, res: Response) {
    const { projectName } = req.body;

    try {
      const user = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.userType", "type")
        .leftJoinAndSelect("user.organisations", "organisations")
        .where("user.email = :email", { email: (req.user as IUserToken).email })
        .getOne();

      if (!user) {
        throw new Error("No user or organisation found.");
      }

      await this.projectRepository.addProject(user, projectName);

      res.status(CREATED);
      res.json({
        errors: [],
        payload: {
          projectName
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
      const projects = await this.projectRepository.getProjectsforUser((req.user as IUserToken).email);

      res.json({
        errors: [],
        payload: projects || []
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