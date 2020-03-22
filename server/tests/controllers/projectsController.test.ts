import { IMock, Mock, It, Times } from "typemoq";
import { ProjectController } from "../../src/controllers";

import { RepositoryService } from "../../src/services/repositoryService";

import { Request, Response } from "express";
import { UserDbo } from "../../src/database/entities/userDbo";
import { ProjectRepository } from "../../src/repositories/projectRepository";
import { ICreateProjectResponse } from "../../src/dto/supplier/createProject";
import { UserRepository } from "../../src/repositories/userRepository";
import { CREATED, INTERNAL_SERVER_ERROR, OK, NOT_FOUND, BAD_REQUEST } from "http-status-codes";
import { ProjectDbo } from "../../src/database/entities/projectDbo";
import { IProjectResponse } from "../../src/dto/supplier/project";
import { IUserToken } from "../../src/dto/common/userToken";
import { TestSuiteRepository } from "../../src/repositories/suiteRepository";
import { SuiteDbo } from "../../src/database/entities/suiteDbo";

suite("Project Controller", () => {
  let userRepository: IMock<UserRepository>;
  let projectRepository: IMock<ProjectRepository>;
  let suiteRepository: IMock<TestSuiteRepository>;
  let repositoryService: IMock<RepositoryService>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: ProjectController;

  suiteSetup(() => {
    userRepository = Mock.ofType<UserRepository>();
    projectRepository = Mock.ofType<ProjectRepository>();
    suiteRepository = Mock.ofType<TestSuiteRepository>();
    repositoryService = Mock.ofType<RepositoryService>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    subject = new ProjectController(projectRepository.object, userRepository.object);
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
          title: "New Project!"
        }

        createProjectResponse = {
          title: createProjectBody.title
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
          errors: ["Error finding user"],
        }), Times.once());
      });

      test("It should have statusCode 400", async () => {
        given_userRepository_getUserByEmail_returns_whenGiven(user, It.isAny());
        given_Request_body_is(createProjectBody);

        await subject.createProject(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });
  });

  suite("Get Project by ID", async () => {
    let getProjectBody: any;
    let project: ProjectDbo;
    let projectResponse: IProjectResponse;

    suite("Valid request conditions", () => {
      suiteSetup(() => {

        const testSuite = new SuiteDbo();
        testSuite.id = "3";
        testSuite.title = "Suite 1";

        project = new ProjectDbo();
        project.id = "4000";
        project.title = "Fetched Project Title"
        project.suites = [ testSuite ];

        getProjectBody = {
          id: project.id
        };

        projectResponse = {
          id: project.id,
          title: project.title,
          suites: project.suites.map(s => ({
            id: s.id,
            title: s.title
          }))
        };
      });

      test("Should return project in response body", async () => {
        given_projectRepository_getProjectById_returns_whenGiven(project, It.isAny());
        given_projectRepository_getTestSuitesForProject_returns_whenGiven(project.suites, It.isAny());
        given_Request_body_is(getProjectBody);

        await subject.getProjectById(req.object, res.object);

        res.verify(r => r.json({
          errors: [],
          payload: projectResponse
        }), Times.once());
      });

      test("Should have statusCode 200", async () => {
        given_projectRepository_getProjectById_returns_whenGiven(project, It.isAny());
        given_Request_body_is(getProjectBody);

        await subject.getProjectById(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Find project by id does not find project", () => {
      suiteSetup(() => {
        getProjectBody = {
          id: "4000"
        };
      });

      test("Should return project in response body", async () => {
        given_projectRepository_getProjectById_returns_whenGiven(undefined, It.isAny());
        given_Request_body_is(getProjectBody);

        await subject.getProjectById(req.object, res.object);

        res.verify(r => r.json({
          errors: ["That project does not exist"],
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

  suite("Get projects", () => {
    let userToken: IUserToken;
    const projects: ProjectDbo[] = [];
    const projectsResponse: IProjectResponse[] = [];

    suite("Valid request conditions", () => {
      suiteSetup(() => {
        userToken = {
          email: "test@me.com",
          type: "Supplier"
        };

        for (let i = 0; i < 10; i++) {
          const p = new ProjectDbo();
          p.id = i + "";
          p.title = "Project " + i;
          projects.push(p);
        }

        for (const project of projects) {
          projectsResponse.push({
            id: project.id,
            title: project.title
          });
        }
      });

      test("Should return list of projects in response body", async () => {
        given_Request_user_is(userToken);
        given_projectRepository_getProjectsForUser_returns_whenGiven(projects, userToken.email);

        await subject.getProjects(req.object, res.object);

        res.verify(r => r.json({
          errors: [],
          payload: projectsResponse
        }), Times.once());
      });

      test("Should return statusCode of 200", async () => {
        given_Request_user_is(userToken);
        given_projectRepository_getProjectsForUser_returns_whenGiven(projects, userToken.email);

        await subject.getProjects(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });
  });

  suite("Delete project", () => {
    let requestParams: any;

    suite("Valid request condtions", () => {
      suiteSetup(() => {
        requestParams =  {
          id: "10"
        };
      });

      test("No errors are returned in the body", async () => {
        given_projectRepository_deleteProject_returns_whenGiven(undefined, requestParams.id);
        given_Request_params_are(requestParams);

        await subject.deleteProject(req.object, res.object);

        res.verify(r => r.json({
          errors: []
        }), Times.once());
      });

      test("Status code is 200", async () => {
        given_projectRepository_deleteProject_returns_whenGiven(undefined, requestParams.id);
        given_Request_params_are(requestParams);

        await subject.deleteProject(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });
  });

  function given_Request_user_is(user: IUserToken) {
    req
      .setup(r => r.user)
      .returns(() => user);
  }

  function given_Request_body_is(body: any): void {
    req
      .setup(r => r.body)
      .returns(() => body);
  }

  function given_Request_params_are(params: any): void {
    req
      .setup(r => r.params)
      .returns(() => params);
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

  function given_projectRepository_getProjectsForUser_returns_whenGiven(returns: ProjectDbo[] | undefined, whenGiven: any) {
    projectRepository
      .setup(pr => pr.getProjectsForUser(whenGiven))
      .returns(async () => returns);
  }

  function given_projectRepository_deleteProject_returns_whenGiven(returns: any, whenGiven: any) {
    projectRepository
      .setup(pr => pr.deleteProjectById(whenGiven))
      .returns(async () => returns);
  }

  function given_projectRepository_getTestSuitesForProject_returns_whenGiven(returns: SuiteDbo[], whenGiven: any) {
    projectRepository
      .setup(pr => pr.getTestSuitesForProject(whenGiven))
      .returns(async () => returns);
  }
});
