import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Get, Delete } from "@overnightjs/core";
import { Request, Response } from "express";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { PermittedAccountTypes } from "../services/middleware/permittedAccountTypes";
import { CreateProjectSchema } from "../services/middleware/joi/schemas/createProject";
import { ProjectDbo } from "../database/entities/projectDbo";
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status-codes";
import { IApiResponse } from "../dto/common/apiResponse";
import { ICreateProjectResponse } from "../dto/supplier/createProject";
import { IUserToken } from "../dto/common/userToken";
import { IProjectResponse } from "../dto/supplier/project";
import { ProjectRepository } from "../repositories/projectRepository";
import { UserRepository } from "../repositories/userRepository";
import { BaseController } from "./baseController";

@injectable()
@Controller("project")
@ClassMiddleware(checkAuthentication)
export class ProjectController extends BaseController {

  constructor(
    private projectRepository: ProjectRepository,
    private userRepository: UserRepository
  ) {
    super();
  }

  @Post("create")
  @Middleware([
    BodyMatches.schema(CreateProjectSchema),
    PermittedAccountTypes.are(["Supplier"])
  ])
  public async createProject(req: Request, res: Response) {
    const { title } = req.body;

    try {
      const user = await this.userRepository.getUserByEmail((req.user as IUserToken).email);
      if (!user) {
        throw new Error("Error finding user");
      }

      await this.projectRepository.addProject(user, title);

      this.created<ICreateProjectResponse>(res, {
        title
      });

    } catch (error) {
      if(error.message === "Error finding user") {
        this.badRequest(res, [ error.message ]);
        return;
      }
      this.serverError(res);
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

      this.OK<IProjectResponse>(res, {
        id: project.id,
        title: project.title,
        suites: project.suites.map(s => ({
          id: s.id,
          title: s.title
        }))
      });
    } catch (error) {
      if(error.message === "That project does not exist") {
        this.notFound(res, [error.message]);
        return;
      }

      this.serverError(res);
    }
  }

  @Get("all")
  public async getProjects(req: Request, res: Response) {
    try {
      let projects = await this.projectRepository.getProjectsForUser((req.user as IUserToken).email);
      projects = projects ? projects : [];

      this.OK<IProjectResponse[]>(res, projects.map(r =>
        ({
          id: r.id,
          title: r.title
        }))
      );
    } catch (error) {
      this.serverError(res);
    }
  }

  @Delete(":id")
  public async deleteProject(req: Request, res: Response) {
    const projectId = req.params.id;

    try {
      const deletedProject = await this.projectRepository.deleteProjectById(projectId);
      this.OK(res);
    } catch (error) {
      this.serverError(res);
    }
  }
}
