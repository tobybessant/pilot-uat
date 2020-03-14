import { IMock, Mock } from "typemoq"
import { ProjectRepository } from "../../src/repositories/projectRepository";
import { RepositoryService } from "../../src/services/repositoryService";
import { Request, Response } from "express";
import { TestSuiteController } from "../../src/controllers";
import { TestSuiteRepository } from "../../src/repositories/testSuiteRepository";

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
  })

  suite("Create Test Suite", async () => {
    suite("Valid request conditions", () => {
      
    });
  });
});
