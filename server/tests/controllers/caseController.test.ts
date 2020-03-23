import { IMock, Mock, It, Times } from "typemoq";
import { Request, Response } from "express";
import { CaseController } from "../../src/controllers";
import { CaseRepository } from "../../src/repositories/caseRepository";
import { TestSuiteRepository } from "../../src/repositories/suiteRepository";
import { RepositoryService } from "../../src/services/repositoryService";
import { CaseDbo } from "../../src/database/entities/caseDbo";
import { ICaseResponse } from "../../src/dto/response/supplier/case";
import { ICreateSuiteRequest } from "../../src/dto/request/supplier/createSuite";
import { ICreateCaseRequest } from "../../src/dto/request/supplier/createCase";
import { SuiteDbo } from "../../src/database/entities/suiteDbo";
import { CREATED } from "http-status-codes";

suite("Case Controller", () => {

  let caseRepository: IMock<CaseRepository>;
  let suiteRepository: IMock<TestSuiteRepository>;
  let repositoryService: IMock<RepositoryService>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: CaseController;

  setup(() => {
    repositoryService = Mock.ofType<RepositoryService>();
    caseRepository = Mock.ofType<CaseRepository>();
    suiteRepository = Mock.ofType<TestSuiteRepository>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    subject = new CaseController(caseRepository.object, suiteRepository.object);
  });

  suite("Create Case", () => {

    let createCaseBody: any;
    let savedCase: CaseDbo;
    let testSuite: SuiteDbo;
    let createCaseResponse: ICaseResponse | undefined;

    suite("Valid request conditions", () => {
      setup(() => {
        createCaseBody = {
          projectId: "4",
          title: "My Case!"
        };

        savedCase = new CaseDbo();
        savedCase.id = createCaseBody.projectId;
        savedCase.title = createCaseBody.title;
        savedCase.steps = [];

        createCaseResponse = {
          id: savedCase.id.toString(),
          title: savedCase.title
        };

        testSuite = new SuiteDbo();
        testSuite.id = 4;
      });

      test("Should return case in response body", async () => {
        given_suiteRepository_getTestSuiteById_returns_whenGiven(testSuite, It.isAny());
        given_caseRepository_save_returns(savedCase);
        given_Request_body_is(createCaseBody);


        await subject.addCase(req.object, res.object);

        res.verify(r => r.json({ errors: [], payload: createCaseResponse }), Times.once());
      });

      test("Should return statusCode 201", async () => {
        given_suiteRepository_getTestSuiteById_returns_whenGiven(testSuite, It.isAny());
        given_caseRepository_save_returns(savedCase);
        given_Request_body_is(createCaseBody);


        await subject.addCase(req.object, res.object);

        res.verify(r => r.status(CREATED), Times.once());
      });
    });

    suite("Suite does not exist", () => {
      
    });

    function given_Request_body_is(body: any): void {
      req
        .setup(r => r.body)
        .returns(() => body);
    }

    function given_caseRepository_save_returns(returns: CaseDbo) {
      caseRepository
        .setup(cr => cr.addCase(It.isAny(), It.isAny()))
        .returns(async () => returns);
    }

    function given_suiteRepository_getTestSuiteById_returns_whenGiven(returns: SuiteDbo, whenGiven: any) {
      suiteRepository
        .setup(sr => sr.getTestSuiteById(whenGiven))
        .returns(async () => returns);
    }

  });


});
