import { IMock, Mock, It, Times } from "typemoq";
import { ProjectRepository } from "../../src/repositories/projectRepository";
import { RepositoryService } from "../../src/services/repositoryService";
import { Request, Response } from "express";
import { TestSuiteController } from "../../src/controllers";
import { TestSuiteRepository } from "../../src/repositories/suiteRepository";
import { ISuiteResponse } from "../../src/dto/response/supplier/suite";
import { SuiteDbo } from "../../src/database/entities/suiteDbo";
import { ProjectDbo } from "../../src/database/entities/projectDbo";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, SERVICE_UNAVAILABLE } from "http-status-codes";
import { BaseController } from "../../src/controllers/baseController";
import { deepStrictEqual } from "../utils/deepStrictEqual";

suite("TestSuiteController", () => {
  let repositoryService: IMock<RepositoryService>;
  let projectRepository: IMock<ProjectRepository>;
  let testSuiteRepository: IMock<TestSuiteRepository>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: TestSuiteController;

  setup(() => {
    repositoryService = Mock.ofType<RepositoryService>();
    projectRepository = Mock.ofType<ProjectRepository>();
    testSuiteRepository = Mock.ofType<TestSuiteRepository>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    subject = new TestSuiteController(testSuiteRepository.object, projectRepository.object);
  });

  teardown(() => {
    repositoryService.reset();
    projectRepository.reset();
    testSuiteRepository.reset();

    req.reset();
    res.reset();
  });

  suite("Create Test Suite", async () => {
    let createTestSuiteBody: any;
    let projectDbo: ProjectDbo;
    let testSuiteDbo: SuiteDbo;
    let createTestSuiteResponse: ISuiteResponse | undefined;

    suite("Valid request conditions", () => {
      setup(() => {
        createTestSuiteBody = {
          projectId: 5,
          suiteName: "New Suite"
        };

        projectDbo = new ProjectDbo();
        projectDbo.title = "New Project";

        testSuiteDbo = new SuiteDbo();
        testSuiteDbo.title = createTestSuiteBody.suiteName;
        testSuiteDbo.id = 5;

        createTestSuiteResponse = {
          title: testSuiteDbo.title,
          id: testSuiteDbo.id.toString()
        };

      });

      test("Should return suiteName and id in response body", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(projectDbo);
        given_testSuiteRepository_addTestSuite_returns(testSuiteDbo);

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, createTestSuiteResponse))), Times.once());
      });

      test("Should return statusCode 200", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(projectDbo);
        given_testSuiteRepository_addTestSuite_returns(testSuiteDbo);

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("projectRepository silently fails to find project and returns undefined", () => {

      setup(() => {
        createTestSuiteBody = {
          projectId: 5,
          suiteName: "New Suite"
        };
      });

      test("Response returns error 'Project does not exist' in errors array", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(undefined);

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, ["Project does not exist"]))), Times.once());
      });

      test("Response returns statusCode 400", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(undefined);

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });

    });

    suite("suiteRepository throws error when adding suite", () => {

      setup(() => {
        createTestSuiteBody = {
          projectId: 5,
          suiteName: "New Suite"
        };

        projectDbo = new ProjectDbo();
        projectDbo.title = "New Project";
      });

      test("Response returns error 'Failed to add suite' in response errors array", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(projectDbo);
        given_testSuiteRepository_addTestSuite_returns(undefined);

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, ["Error adding suite"]))), Times.once());
      });

      test("Response returns statusCode 503", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(projectDbo);
        given_testSuiteRepository_addTestSuite_returns(undefined);

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.status(SERVICE_UNAVAILABLE), Times.once());
      });

    });

    suite("Unexpected 'Error' thrown by projectRepository", () => {

      setup(() => {
        createTestSuiteBody = {
          projectId: 5,
          suiteName: "New Suite"
        };
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} is returned in response errors`, async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_throws();

        subject.createTestSuite(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Reponse returns statusCode 500", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_throws();

        subject.createTestSuite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });

    });

    suite("Unexpected 'Error' thrown by testSuiteRepository", () => {

      setup(() => {
        createTestSuiteBody = {
          projectId: 5,
          suiteName: "New Suite"
        };

        projectDbo = new ProjectDbo();
        projectDbo.title = "New Project";
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} is returned in response errors`, async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(projectDbo);
        given_testSuiteRepository_addTestSuite_throws();

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(projectDbo);
        given_testSuiteRepository_addTestSuite_throws();

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });

    });
  });

  suite("Get all test suites for a project", async () => {
    let getTestSuitesBody: any;
    const testSuiteDboList: SuiteDbo[] = [];
    const getAllTestSuitesResponse: ISuiteResponse[] = [];

    suite("Valid request conditions", () => {
      setup(() => {
        getTestSuitesBody = {
          projectId: "5"
        };

        for (let i = 0; i < 1; i++) {
          const ts = new SuiteDbo();
          ts.id = i;
          ts.title = "Suite " + i;
          testSuiteDboList.push(ts);
        }

        for (const suite of testSuiteDboList) {
          getAllTestSuitesResponse.push({
            id: suite.id.toString(),
            title: suite.title
          });
        }
      });

      test("Test suite list is returned in response body", async () => {
        given_projectRepository_getTestSuitesForProject_returns(testSuiteDboList);
        given_Request_body_is(getTestSuitesBody);

        await subject.getTestSuites(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, getAllTestSuitesResponse))), Times.once());
      });

      test("Should return statusCode 200", async () => {
        given_projectRepository_getTestSuitesForProject_returns(testSuiteDboList);
        given_Request_body_is(getTestSuitesBody);

        await subject.getTestSuites(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });

    });

    suite("Unexpected 'Error' thrown by projectsRepository", () => {

      setup(() => {
        getTestSuitesBody = {
          projectId: "5"
        };
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} is returned in response errors`, async () => {
        given_Request_body_is(getTestSuitesBody);
        given_projectRepository_getTestSuitesForProject_throws();

        await subject.getTestSuites(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(getTestSuitesBody);
        given_projectRepository_getTestSuitesForProject_throws();

        await subject.getTestSuites(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("Delete test suite from project", async () => {
    let deleteTestSuiteParams: any;

    suite("Valid request conditions", () => {
      setup(() => {
        deleteTestSuiteParams = {
          suiteId: "50"
        };
      });

      test("Should return nothing in response payload", async () => {
        given_Request_params_are(deleteTestSuiteParams);

        await subject.deleteSuite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.payload === undefined)), Times.once());
      });

      test("Should return statusCode 200", async () => {
        given_Request_params_are(deleteTestSuiteParams);

        await subject.deleteSuite(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectRepository", () => {

      setup(() => {
        deleteTestSuiteParams = {
          suiteId: "50"
        };
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} is returned in response errors`, async () => {
        given_Request_params_are(deleteTestSuiteParams);
        given_suiteRepository_deleteTestSuiteById_throws();

        await subject.deleteSuite(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_params_are(deleteTestSuiteParams);
        given_suiteRepository_deleteTestSuiteById_throws();

        await subject.deleteSuite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

  });

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

  function given_testSuiteRepository_addTestSuite_returns(returns: SuiteDbo | undefined) {
    testSuiteRepository
      .setup(tsr => tsr.addTestSuite(It.isAny(), It.isAny()))
      .returns(async () => returns);
  }

  function given_testSuiteRepository_addTestSuite_throws() {
    testSuiteRepository
      .setup(tsr => tsr.addTestSuite(It.isAny(), It.isAny()))
      .throws(new Error("Sensitive database inforamtion!"));
  }

  function given_projectRepository_getProjectById_returns(returns: ProjectDbo | undefined) {
    projectRepository
      .setup(pr => pr.getProjectById(It.isAny()))
      .returns(async () => returns);
  }

  function given_projectRepository_getTestSuitesForProject_returns(returns: SuiteDbo[]) {
    projectRepository
      .setup(pr => pr.getTestSuitesForProject(It.isAny()))
      .returns(async () => returns);
  }

  function given_projectRepository_getProjectById_throws() {
    projectRepository
      .setup(pr => pr.getProjectById(It.isAny()))
      .throws(new Error("Sensitive database information!"));
  }

  function given_projectRepository_getTestSuitesForProject_throws() {
    projectRepository
      .setup(pr => pr.getTestSuitesForProject(It.isAny()))
      .throws(new Error("Sensitive database information!"));
  }

  function given_suiteRepository_deleteTestSuiteById_throws() {
    testSuiteRepository
      .setup(tsr => tsr.deleteTestSuiteById(It.isAny()))
      .throws(new Error("Sensitive database information!"));
  }
});
