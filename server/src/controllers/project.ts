import { injectable } from "tsyringe";
import { Controller, ClassMiddleware, Post, Middleware, Get, Delete } from "@overnightjs/core";
import { Request, Response } from "express";
import { checkAuthentication } from "../services/middleware/checkAuthentication";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { PermittedAccountTypes } from "../services/middleware/permittedAccountTypes";
import { CreateProject } from "../services/middleware/joi/schemas/createProject";
import { IUserToken } from "../dto/response/common/userToken";
import { IProjectResponse } from "../dto/response/supplier/project";
import { ProjectRepository } from "../repositories/projectRepository";
import { UserRepository } from "../repositories/userRepository";
import { BaseController } from "./baseController";
import { ICreateProjectRequest } from "../dto/request/supplier/createProject";
import { Validator } from "joiful";
import { IUserResponse } from "../dto/response/common/user";
import { ProjectInviteRepository } from "../repositories/projectInviteRepository";
import { BASE_ENDPOINT } from "./BASE_ENDPOINT";
import { ProjectDbo } from "../database/entities/projectDbo";

@injectable()
@Controller(`${BASE_ENDPOINT}/projects`)
@ClassMiddleware(checkAuthentication)
export class ProjectController extends BaseController {

  constructor(
    private projectRepository: ProjectRepository,
    private userRepository: UserRepository,
    private projectInviteRepository: ProjectInviteRepository
  ) {
    super();
  }

  @Post()
  @Middleware([
    new BodyMatches(new Validator()).schema(CreateProject),
    PermittedAccountTypes.are(["Supplier"])
  ])
  public async createProject(req: Request, res: Response) {
    const model: ICreateProjectRequest = req.body;

    try {
      const user = await this.userRepository.getUserByEmail((req.user as IUserToken).email);
      if (!user) {
        return this.badRequest(res, ["Error finding user"]);
      }

      const project = await this.projectRepository.addProject(user, model.title);

      this.created<IProjectResponse>(res, {
        title: project.title,
        id: project.id.toString(),
        suites: project.suites.map(suite => ({
          id: suite.id.toString(),
          title: suite.title
        }))
      });

    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Get(":id")
  public async getProjectById(req: Request, res: Response) {
    try {
      const authorised = await this.projectRepository.userHasAccessToProject(req.user!.email, req.params.id);
      if (!authorised) {
        return this.badRequest(res, ["Error finding project"]);
      }

      const project = await this.projectRepository.getProjectById(req.params.id, req.query.extensive);

      if (!project) {
        return this.badRequest(res, ["Error finding project"]);
      }

      if (req.query.extensive) {
        const payloadExt: any = {
          id: project.id.toString(),
          title: project.title,
          suites: project.suites.map(s => ({
            id: s.id.toString(),
            title: s.title,
            cases: s.cases.map(c => ({
              id: c.id.toString(),
              title: c.title,
              steps: c.steps.map(st => ({
                id: st.id.toString(),
                description: st.description
              }))
            }))
          }))
        };

        return this.OK<IProjectResponse>(res, payloadExt);
      }

      const payload: IProjectResponse = {
        id: project.id.toString(),
        title: project.title,
        suites: project.suites.map(s => ({
          id: s.id.toString(),
          title: s.title
        }))
      };

      return this.OK<IProjectResponse>(res, payload);
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  @Get()
  public async getProjects(req: Request, res: Response) {
    try {
      let projects = await this.projectRepository.getProjectsForUser((req.user as IUserToken).email);
      projects = projects ? projects : [];

      this.OK<IProjectResponse[]>(res, projects.map(r =>
        ({
          id: r.id.toString(),
          title: r.title
        }))
      );
    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Delete(":id")
  public async deleteProject(req: Request, res: Response) {
    const projectId = req.params.id;

    try {
      const deletedProject = await this.projectRepository.deleteProjectById(projectId);
      this.OK(res);
    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Get(":id/users")
  public async getUsersForProject(req: Request, res: Response) {
    const userRoles = await this.projectRepository.getUsersForProject(req.params.id, req.query.type);

    this.OK<IUserResponse[]>(res, userRoles.map(role => ({
      id: role.user.id,
      email: role.user.email,
      firstName: role.user.firstName,
      lastName: role.user.lastName,
      type: role.user.userType.type,
      organisations: role.user.organisations,
      createdDate: role.user.createdDate
    })));
  }

  @Get(":id/invites")
  public async getOpenInvites(req: Request, res: Response) {
    try {
      const invites = await this.projectInviteRepository.getOpenInvitesForProject(req.params.id);

      this.OK<any>(res, invites.map(invite => ({
        id: invite.id.toString(),
        userEmail: invite.userEmail,
        userType: invite.userType,
        status: invite.status
      })));
    } catch (error) {
      this.serverError(res, error);
    }
  }

  @Delete(":id/:userId")
  public async removeUser(req: Request, res: Response) {
    try {
      const removedJoin = await this.projectRepository.removeUserFromProject(req.params.userId, req.params.id);
      this.OK(res);
    } catch (error) {
      this.serverError(res, error);
    }
  }
}
