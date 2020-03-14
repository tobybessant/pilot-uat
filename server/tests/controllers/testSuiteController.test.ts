import { IMock, Mock, It } from "typemoq"
import { ProjectRepository } from "../../src/repositories/projectRepository";
import { RepositoryService } from "../../src/services/repositoryService";
import { Request, Response } from "express";
import { TestSuiteController } from "../../src/controllers";
import { TestSuiteRepository } from "../../src/repositories/testSuiteRepository";
import { ITestSuiteResponse } from "../../src/dto/supplier/testSuite";
import { TestSuiteDbo } from "../../src/database/entities/testSuiteDbo";

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
    let testSuiteDbo: TestSuiteDbo;
    let createTestSuiteResponse: ITestSuiteResponse | undefined;

    suite("Valid request conditions", () => {
      suiteSetup(() => {
        createTestSuiteBody = {
          suiteName: "New Suite"
        };

        testSuiteDbo = new TestSuiteDbo();
        testSuiteDbo.suiteName = createTestSuiteBody.suiteName;
        testSuiteDbo.id = "5";

        createTestSuiteResponse = {
          suiteName: testSuiteDbo.suiteName,
          id: testSuiteDbo.id
        };

      });

      test("Should return suiteName and id in response body", () => {
        given_Request_body_is(createTestSuiteBody);
        given_testSuiteRepository_addTestSuite_returns(testSuiteDbo);

        
      });

    });
  });

  function given_Request_body_is(body: any): void {
    req
      .setup(r => r.body)
      .returns(() => body);
  };

  function given_testSuiteRepository_addTestSuite_returns(returns: TestSuiteDbo) {
    testSuiteRepository
      .setup(tsr => tsr.addTestSuite(It.isAny(), It.isAny()))
      .returns(async () => returns);
  }
});
