import { IMock, Mock, It, Times } from "typemoq"
import { ProjectRepository } from "../../src/repositories/projectRepository";
import { RepositoryService } from "../../src/services/repositoryService";
import { Request, Response } from "express";
import { TestSuiteController } from "../../src/controllers";
import { TestSuiteRepository } from "../../src/repositories/testSuiteRepository";
import { ISuiteResponse } from "../../src/dto/supplier/testSuite";
import { SuiteDbo } from "../../src/database/entities/suiteDbo";
import { ProjectDbo } from "../../src/database/entities/projectDbo";
import { OK } from "http-status-codes";

suite("TestSuiteController", () => {
  let repositoryService: IMock<RepositoryService>;
  let projectRepository: IMock<ProjectRepository>;
  let testSuiteRepository: IMock<TestSuiteRepository>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: TestSuiteController;

  suiteSetup(() => {
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
      suiteSetup(() => {
        createTestSuiteBody = {
          suiteName: "New Suite"
        };

        projectDbo = new ProjectDbo();
        projectDbo.title = "New Project";

        testSuiteDbo = new SuiteDbo();
        testSuiteDbo.title = createTestSuiteBody.suiteName;
        testSuiteDbo.id = "5";

        createTestSuiteResponse = {
          title: testSuiteDbo.title,
          id: testSuiteDbo.id
        };

      });

      test("Should return suiteName and id in response body", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(projectDbo);
        given_testSuiteRepository_addTestSuite_returns(testSuiteDbo);

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.json({ errors: [], payload: createTestSuiteResponse }), Times.once());
      });

      test("Should return statusCode 200", async () => {
        given_Request_body_is(createTestSuiteBody);
        given_projectRepository_getProjectById_returns(projectDbo);
        given_testSuiteRepository_addTestSuite_returns(testSuiteDbo);

        await subject.createTestSuite(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });
  });

  suite("Get all test suites for a project", async () => {
    let getTestSuitesBody: any;
    const testSuiteDboList: SuiteDbo[] = [];
    const getAllTestSuitesResponse: ISuiteResponse[] = [];

    suite("Valid request conditions", () => {
      suiteSetup(() => {
        getTestSuitesBody = {
          projectId: "5"
        };

        for (let i = 0; i < 1; i++) {
          const ts = new SuiteDbo();
          ts.id = i + "";
          ts.title = "Suite " + i;
          testSuiteDboList.push(ts);
        }

        for (const suite of testSuiteDboList) {
          getAllTestSuitesResponse.push({
            id: suite.id,
            title: suite.title
          });
        }
      });

      test("Test suite list is returned in response body", async () => {
        given_projectRepository_getTestSuitesForProject_returns(testSuiteDboList);
        given_Request_body_is(getTestSuitesBody);

        await subject.getTestSuites(req.object, res.object);

        res.verify(r => r.json({ errors: [], payload: getAllTestSuitesResponse }), Times.once());
      });

      test("Should return statusCode 200", async () => {
        given_projectRepository_getTestSuitesForProject_returns(testSuiteDboList);
        given_Request_body_is(getTestSuitesBody);

        await subject.getTestSuites(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });

    })
  });

  suite("Delete test suite from project", async () => {
    let deleteTestSuiteBody: any;

    suite("Valid request conditions", () => {
      suiteSetup(() => {
        deleteTestSuiteBody = {
          suiteId: "500"
        }
      });

      test("Should return nothing in response body", async () => {
        given_Request_body_is(deleteTestSuiteBody);

        await subject.deleteSuite(req.object, res.object);

        res.verify(r => r.json({ errors: [] }), Times.once());
      });

      test("Should return statusCode 200", async () => {
        given_Request_body_is(deleteTestSuiteBody);

        await subject.deleteSuite(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });
  });

  function given_Request_body_is(body: any): void {
    req
      .setup(r => r.body)
      .returns(() => body);
  };

  function given_testSuiteRepository_addTestSuite_returns(returns: SuiteDbo) {
    testSuiteRepository
      .setup(tsr => tsr.addTestSuite(It.isAny(), It.isAny()))
      .returns(async () => returns);
  };

  function given_projectRepository_getProjectById_returns(returns: ProjectDbo) {
    projectRepository
      .setup(pr => pr.getProjectById(It.isAny()))
      .returns(async () => returns);
  };

  function given_projectRepository_getTestSuitesForProject_returns(returns: SuiteDbo[]) {
    projectRepository
    .setup(pr => pr.getTestSuitesForProject(It.isAny()))
    .returns(async () => returns);
  };
});
