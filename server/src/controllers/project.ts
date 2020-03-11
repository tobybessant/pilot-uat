import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Get, Delete } from "@overnightjs/core";
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
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status-codes";
import { IApiResponse } from "../models/response/apiresponse";
import { ICreateProjectResponse } from "../models/response/createProject";
import { IUserToken } from "../models/response/usertoken";
import { IProjectResponse } from "../models/response/project";
import { ProjectRepository } from "../repositories/project.repository";
import { UserRepository } from "../repositories/user.repository";

@injectable()
@Controller("project")
@ClassMiddleware(checkAuthentication)
export class ProjectController {

  private projectRepository: ProjectRepository;
  private userRepository: UserRepository;

  constructor(
    private repositoryService: RepositoryService,
  ) {
    this.projectRepository = repositoryService.getCustomRepositoryFor(ProjectRepository);
    this.userRepository = repositoryService.getCustomRepositoryFor(UserRepository);
  }

  @Post("create")
  @Middleware([
    BodyMatches.modelSchema(ICreateProjectRequest),
    PermittedAccountTypes.are(["Supplier"])
  ])
  public async createProject(req: Request, res: Response) {
    const { projectName } = req.body;

    try {
      const user = await this.userRepository.getUserByEmail((req.user as IUserToken).email);
      if (!user) {
        throw new Error("Error finding user");
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

      const errors: string[] = [
        error.message ? error.message : "Error creating project"
      ];

      res.status(INTERNAL_SERVER_ERROR);
      res.json({ errors } as IApiResponse<ICreateProjectResponse>);
    }
  }

  @Post()
  public async getProjectById(req: Request, res: Response) {
    const { id } = req.body;

    try {
      const project = await this.projectRepository.getProjectById(id);

      if (!project) {
        throw new Error("That project does not exist");
      }

      res.json({
        errors: [],
        payload: project
      } as IApiResponse<IProjectResponse>);
      res.status(OK);
    } catch (error) {
      res.status(NOT_FOUND);
      res.json({
        errors: [error.message]
      } as IApiResponse<IProjectResponse>);
    }
  }

  @Get("all")
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

  @Delete(":id")
  public async deleteProject(req: Request, res: Response) {
    const projectId = req.params.id;

    try {

      const deletedProject = await this.projectRepository.deleteProjectById(projectId);
      res.status(OK);
      res.json({
        errors: []
      } as unknown as IApiResponse<any>);
      return;

    } catch (error) {
      res.status(BAD_REQUEST);
      res.json({
        errors: [error.message]
      } as IApiResponse<any>);
    }
  }
}