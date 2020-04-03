import { IMock, Mock, It, Times } from "typemoq";
import { Request, Response } from "express";
import { CaseController } from "../../src/controllers";
import { CaseRepository } from "../../src/repositories/caseRepository";
import { TestSuiteRepository } from "../../src/repositories/suiteRepository";
import { RepositoryService } from "../../src/services/repositoryService";
import { CaseDbo } from "../../src/database/entities/caseDbo";
import { ICaseResponse } from "../../src/dto/response/supplier/case";
import { SuiteDbo } from "../../src/database/entities/suiteDbo";
import { CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
import { IGetAllCasesRequest } from "../../src/dto/request/supplier/getAllCases";
import { IUpdateCaseRequest } from "../../src/dto/request/supplier/updateCase";
import { DeleteResult } from "typeorm";
import { BaseController } from "../../src/controllers/baseController";
import { deepStrictEqual } from "../utils/deepStrictEqual";

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

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, createCaseResponse))), Times.once());
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
      });

      test("Error contains 'Suite could not found'", async () => {
        given_suiteRepository_getTestSuiteById_returns_whenGiven(undefined, It.isAny());
        given_caseRepository_save_returns(savedCase);
        given_Request_body_is(createCaseBody);

        await subject.addCase(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, ["Suite not found"]))), Times.once());
      });

      test("Returns a statusCode of 400", async () => {
        given_suiteRepository_getTestSuiteById_returns_whenGiven(undefined, It.isAny());
        given_caseRepository_save_returns(savedCase);
        given_Request_body_is(createCaseBody);

        await subject.addCase(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });

    suite("Unexpected 'Error' is thrown inside suiteRepository", () => {
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

      test(`Generic error thrown, containing '${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}'`, async () => {
        given_suiteRepository_throws();
        given_caseRepository_save_returns(savedCase);
        given_Request_body_is(createCaseBody);

        await subject.addCase(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Returns statusCode 500", async () => {
        given_suiteRepository_throws();
        given_caseRepository_save_returns(savedCase);
        given_Request_body_is(createCaseBody);

        await subject.addCase(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' is thrown inside caseRepository", () => {
      createCaseBody = {
        suiteId: "4",
        title: "My Case!"
      };

      savedCase = new CaseDbo();
      savedCase.id = 40;
      savedCase.title = createCaseBody.title;
      savedCase.steps = [];

      createCaseResponse = {
        id: savedCase.id.toString(),
        title: savedCase.title
      };

      testSuite = new SuiteDbo();
      testSuite.id = 4;

      test(`Generic error thrown, containing '${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}'`, async () => {
        given_suiteRepository_getTestSuiteById_returns_whenGiven(testSuite, It.isAny());
        given_caseRepository_throws();
        given_Request_body_is(createCaseBody);

        await subject.addCase(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Returns statusCode 500", async () => {
        given_suiteRepository_getTestSuiteById_returns_whenGiven(testSuite, It.isAny());
        given_caseRepository_throws();
        given_Request_body_is(createCaseBody);

        await subject.addCase(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("Get Cases for Suite", () => {
    let getAllCasesBody: IGetAllCasesRequest;
    const cases: CaseDbo[] = [];
    const getAllCasesResponse: ICaseResponse[] = [];

    suite("Valid request conditions", () => {

      setup(() => {
        getAllCasesBody = {
          suiteId: "4"
        };

        for (let i = 0; i < 10; i++) {
          const c = new CaseDbo();
          c.id = i;
          c.title = "Project " + i;
          cases.push(c);
        }

        for (const testCase of cases) {
          getAllCasesResponse.push({
            id: testCase.id.toString(),
            title: testCase.title
          });
        }
      });

      test("An ICaseResponse array is returned in response body", async () => {
        given_Request_body_is(getAllCasesBody);
        given_caseRepository_getCasesForTestSuite_returns(cases, It.isAny());

        await subject.getCasesForSuite(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, getAllCasesResponse))), Times.once());
      });

      test("Response returns statusCode 200", async () => {
        given_Request_body_is(getAllCasesBody);
        given_caseRepository_getCasesForTestSuite_returns(cases, It.isAny());

        await subject.getCasesForSuite(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by caseRepository", () => {

      setup(() => {
        getAllCasesBody = {
          suiteId: "4"
        };
      });

      test(`Error returned in response reads '${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}'`, async () => {
        given_Request_body_is(getAllCasesBody);
        given_caseRepository_getCasesForTestSuite_throws();

        await subject.getCasesForSuite(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns status code 500", async () => {
        given_Request_body_is(getAllCasesBody);
        given_caseRepository_getCasesForTestSuite_throws();

        await subject.getCasesForSuite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("Update Case", () => {
    let updateCaseBody: IUpdateCaseRequest;
    let updateCaseResponse: ICaseResponse;
    let updatedCaseDbo: CaseDbo;

    suite("Valid request conditions", () => {

      setup(() => {
        updateCaseBody = {
          title: "Hello"
        };

        updatedCaseDbo = new CaseDbo();
        updatedCaseDbo.id = 3;
        updatedCaseDbo.title = updateCaseBody.title!;

        updateCaseResponse = {
          id: updatedCaseDbo.id.toString(),
          title: updatedCaseDbo.title
        };

      });

      test("Returns updated case details in response payload", async () => {
        given_caseRepository_updateCase_returns_whenGiven(updatedCaseDbo, It.isAny());
        given_Request_body_is(updateCaseBody);

        await subject.updateCase(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload,updateCaseResponse))), Times.once());

      });

      test("Returns statusCode 200", async () => {
        given_caseRepository_updateCase_returns_whenGiven(updatedCaseDbo, It.isAny());
        given_Request_body_is(updateCaseBody);

        await subject.updateCase(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by caseRepository", () => {

      setup(() => {
        updateCaseBody = {
          title: "Hello"
        };
      });

      test(`Response returns error '${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}'`, async () => {
        given_Request_body_is(updateCaseBody);
        given_caseRepository_updateCase_throws();

        await subject.updateCase(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());

      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(updateCaseBody);
        given_caseRepository_updateCase_throws();

        await subject.updateCase(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("Delete Case", () => {
    let deleteCaseId: number;
    let deleteResult: DeleteResult;

    suite("Valid request conditions", () => {

      setup(() => {
        deleteCaseId = 1;

        deleteResult = new DeleteResult();
        deleteResult.affected = 1;
      });

      test("Nothing is returned in response payload", async () => {
        given_Request_params_contain({ id: deleteCaseId });

        await subject.deleteCaseById(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.payload === undefined)), Times.once());
      });

      test("Response returns statusCode 200", async () => {
        given_Request_params_contain({ id: deleteCaseId });

        await subject.deleteCaseById(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by caseRepository", () => {

      setup(() => {
        deleteCaseId = 1;
      });

      test(`Response payload contains generic '${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}' error message`, async () => {
        given_Request_params_contain({ id: deleteCaseId });
        given_caseRepository_deleteCaseById_throws();

        await subject.deleteCaseById(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_params_contain({ id: deleteCaseId });
        given_caseRepository_deleteCaseById_throws();

        await subject.deleteCaseById(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
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

  function given_suiteRepository_getTestSuiteById_returns_whenGiven(returns: SuiteDbo | undefined, whenGiven: any) {
    suiteRepository
      .setup(sr => sr.getTestSuiteById(whenGiven))
      .returns(async () => returns);
  }

  function given_suiteRepository_throws() {
    suiteRepository
      .setup(sr => sr.getTestSuiteById(It.isAny()))
      .throws(new Error("DATABASE Table Failure, sensitive table information here..."));
  }

  function given_caseRepository_throws() {
    caseRepository
      .setup(cr => cr.addCase(It.isAny(), It.isAny()))
      .throws(new Error("DATABASE Table Failure, sensitive table information here..."));
  }

  function given_caseRepository_getCasesForTestSuite_returns(returns: CaseDbo[], whenGiven: any) {
    caseRepository
      .setup(cr => cr.getCasesForTestSuite(whenGiven))
      .returns(async () => returns);
  }

  function given_caseRepository_getCasesForTestSuite_throws() {
    caseRepository
      .setup(cr => cr.getCasesForTestSuite(It.isAny()))
      .throws(new Error("DATABASE Table Failure, sensitive table information here..."));
  }

  function given_caseRepository_updateCase_returns_whenGiven(returns: CaseDbo, whenGiven: any) {
    caseRepository
      .setup(cr => cr.updateCase(It.isAny(), whenGiven))
      .returns(async () => returns);
  }

  function given_caseRepository_updateCase_throws() {
    caseRepository
      .setup(cr => cr.updateCase(It.isAny(), It.isAny()))
      .throws(new Error("DATABASE Table Failure, sensitive table information here..."));
  }

  function given_caseRepository_deleteCaseById_throws() {
    caseRepository
      .setup(cr => cr.deleteCaseById(It.isAny()))
      .throws(new Error("DATABASE Table Failure, sensitive table information here..."));
  }

  function given_Request_params_contain(params: any) {
    req
      .setup(r => r.params)
      .returns(() => params);
  }
});
