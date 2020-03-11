import { IMock, Mock, It, Times } from "typemoq";
import { ProjectController } from "../../src/controllers";

import { RepositoryService } from "../../src/services/repositoryservice";

import { Request, Response } from "express";
import { UserDbo } from "../../src/database/entities/userDbo";
import { ProjectRepository } from "../../src/repositories/project.repository";
import { ICreateProjectResponse } from "../../src/models/response/createProject";
import { UserRepository } from "../../src/repositories/user.repository";
import { CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, NOT_FOUND } from "http-status-codes";
import { ProjectDbo } from "../../src/database/entities/projectDbo";

suite("Project Controller", () => {
  let userRepository: IMock<UserRepository>;
  let projectRepository: IMock<ProjectRepository>;
  let repositoryService: IMock<RepositoryService>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: ProjectController;

  suiteSetup(() => {
    userRepository = Mock.ofType<UserRepository>();
    projectRepository = Mock.ofType<ProjectRepository>();
    repositoryService = Mock.ofType<RepositoryService>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    // setup mock repository to return requested repositories
    given_RepositoryService_getCustomRepositoryFor_returns_whenGiven(projectRepository.object, ProjectRepository);
    given_RepositoryService_getCustomRepositoryFor_returns_whenGiven(userRepository.object, UserRepository);

    subject = new ProjectController(repositoryService.object);
  });

  teardown(() => {
    userRepository.reset();
    repositoryService.reset();
    req.reset();
    res.reset();
  });

  suite("Create Project", async () => {
    let createProjectBody: any;
    let createProjectResponse: ICreateProjectResponse | undefined;
    let user: UserDbo | undefined;

    suite("Valid request conditions", () => {
      suiteSetup(() => {
        createProjectBody = {
          projectName: "New Project!"
        }

        createProjectResponse = {
          projectName: createProjectBody.projectName
        }

        user = new UserDbo();
      });

      test("It should return the projectName in the response body", async () => {
        given_userRepository_getUserByEmail_returns_whenGiven(user, It.isAny());
        given_Request_body_is(createProjectBody);

        await subject.createProject(req.object, res.object);

        res.verify(r => r.json({
          errors: [],
          payload: createProjectResponse
        }), Times.once());
      });

      test("It should have statusCode 201", async () => {
        given_userRepository_getUserByEmail_returns_whenGiven(user, It.isAny());
        given_Request_body_is(createProjectBody);

        await subject.createProject(req.object, res.object);

        res.verify(r => r.status(CREATED), Times.once());
      })
    });

    suite("Find user by email fails", async () => {
      suiteSetup(() => {
        createProjectBody = {
          projectName: "New Project2!"
        };
        createProjectResponse = undefined;
        user = undefined;
      });

      test("Should return error 'Error finding user'", async () => {
        given_userRepository_getUserByEmail_returns_whenGiven(user, It.isAny());
        given_Request_body_is(createProjectBody);

        await subject.createProject(req.object, res.object);

        res.verify(r => r.json({
          errors: [ "Error finding user" ],
        }), Times.once());
      });

      test("It should have statusCode 500", async () => {
        given_userRepository_getUserByEmail_returns_whenGiven(user, It.isAny());
        given_Request_body_is(createProjectBody);

        await subject.createProject(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("Get Project by ID", async () => {
    let getProjectBody: any;
    let projectResponse: ProjectDbo;

    suite("Valid request conditions", () => {
      suiteSetup(() => {
        getProjectBody = {
          id: "1209"
        }

        projectResponse = new ProjectDbo();
        projectResponse.id = getProjectBody.id;
        projectResponse.projectName = "GetByIdProject"

      });

      test("Should return project in response body", async () => {
        given_projectRepository_getProjectById_returns_whenGiven(projectResponse, It.isAny());
        given_Request_body_is(getProjectBody);

        await subject.getProjectById(req.object, res.object);

        res.verify(r => r.json({
          errors: [],
          payload: projectResponse
        }), Times.once());
      });

      test("Should have statusCode 200", async () => {
        given_projectRepository_getProjectById_returns_whenGiven(projectResponse, It.isAny());
        given_Request_body_is(getProjectBody);

        await subject.getProjectById(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Find project by id fails (returns undefined)", () => {
      suiteSetup(() => {
        getProjectBody = {
          id: "1209"
        }
      });

      test("Should return project in response body", async () => {
        given_projectRepository_getProjectById_returns_whenGiven(undefined, It.isAny());
        given_Request_body_is(getProjectBody);

        await subject.getProjectById(req.object, res.object);

        res.verify(r => r.json({
          errors: [ "That project does not exist" ],
        }), Times.once());
      });

      test("Should have statusCode 404", async () => {
        given_projectRepository_getProjectById_returns_whenGiven(undefined, It.isAny());
        given_Request_body_is(getProjectBody);

        await subject.getProjectById(req.object, res.object);

        res.verify(r => r.status(NOT_FOUND), Times.once());
      });
    });
  });

  function given_RepositoryService_getCustomRepositoryFor_returns_whenGiven<T>(returns: T, whenGiven: any): void {
    repositoryService
      .setup(rs => rs.getCustomRepositoryFor<T>(whenGiven))
      .returns(() => returns);
  }

  function given_Request_body_is(body: any): void {
    req
      .setup(r => r.body)
      .returns(() => body);
  }

  function given_userRepository_getUserByEmail_returns_whenGiven(returns: UserDbo | undefined, whenGiven: any) {
    userRepository
      .setup(ur => ur.getUserByEmail(whenGiven))
      .returns(async () => returns);
  }

  function given_projectRepository_getProjectById_returns_whenGiven(returns: ProjectDbo | undefined, whenGiven: any) {
    projectRepository
      .setup(pr => pr.getProjectById(whenGiven))
      .returns(async () => returns);
  }
});