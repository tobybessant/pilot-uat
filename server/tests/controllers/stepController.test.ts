import { IMock, Mock, It, Times } from "typemoq";
import { Request, Response } from "express";
import { StepController } from "../../src/controllers";
import StepRepository from "../../src/repositories/stepRepository";
import { ICreateStepRequest } from "../../src/dto/request/supplier/createStep";
import { StepDbo } from "../../src/database/entities/stepDbo";
import { IStepResponse } from "../../src/dto/response/supplier/step";
import { IStepResponse as IStepResponseClient } from "../../src/dto/response/client/step.interface";
import { StepStatus, StepStatusDbo } from "../../src/database/entities/stepStatusDbo";
import { CaseRepository } from "../../src/repositories/caseRepository";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from "http-status-codes";
import { BaseController } from "../../src/controllers/baseController";
import { IUpdateStepRequest } from "../../src/dto/request/supplier/updateStep";
import { deepStrictEqual } from "../testUtils/deepStrictEqual";
import StepStatusRepository from "../../src/repositories/stepStatusRepository";
import { StepFeedbackRepository } from "../../src/repositories/stepFeedbackRepository";
import { IUserToken } from "../../src/dto/response/common/userToken";
import { StepFeedbackDbo } from "../../src/database/entities/stepFeedbackDbo";
import { UserDbo } from "../../src/database/entities/userDbo";

suite("Step Controller", () => {
  let stepRepository: IMock<StepRepository>;
  let caseRepository: IMock<CaseRepository>;
  let stepStatusRepository: IMock<StepStatusRepository>;
  let stepFeedbackRepository: IMock<StepFeedbackRepository>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: StepController;

  setup(() => {
    stepRepository = Mock.ofType<StepRepository>();
    caseRepository = Mock.ofType<CaseRepository>();
    stepStatusRepository = Mock.ofType<StepStatusRepository>();
    stepFeedbackRepository = Mock.ofType<StepFeedbackRepository>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    subject = new StepController(stepRepository.object, stepStatusRepository.object, stepFeedbackRepository.object);
  });

  suite("Add Step to Test Case", () => {
    let addStepBody: ICreateStepRequest;
    let createdStep: StepDbo;
    let createdStepResponse: IStepResponse;

    suite("Valid request conditions", () => {

      setup(() => {
        addStepBody = {
          caseId: "4",
          description: "I am a new test step!"
        };

        createdStep = new StepDbo();
        createdStep.description = addStepBody.description;
        createdStep.id = 3;

        createdStepResponse = {
          description: createdStep.description,
          id: createdStep.id.toString(),
        };
      });

      test("Saved step is returned in response body", async () => {
        given_Request_body_is(addStepBody);
        given_stepRepository_addStepForCase_returns(createdStep);

        await subject.addStepToCase(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, createdStepResponse))), Times.once());
      });

      test("Response returns statusCode 200", async () => {
        given_Request_body_is(addStepBody);
        given_stepRepository_addStepForCase_returns(createdStep);

        await subject.addStepToCase(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by stepRepository", () => {

      setup(() => {
        addStepBody = {
          caseId: "4",
          description: " I am also a new test step!"
        };
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} is returned in errors array`, async () => {
        given_Request_body_is(addStepBody);
        given_stepRepository_addStepForCase_throws();

        await subject.addStepToCase(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(addStepBody);
        given_stepRepository_addStepForCase_throws();

        await subject.addStepToCase(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("Get Steps for Case", () => {
    let user: IUserToken;
    let query: any;
    let stepStatus: StepStatusDbo;
    const steps: StepDbo[] = [];

    const supplierGetAllStepsResponse: IStepResponse[] = [];
    const clientGetAllStepsResponse: IStepResponseClient[] = [];


    suite("As Supplier", () => {

      setup(() => {
        user = {
          email: "xy@me.com",
          type: "Supplier"
        };
      });

      suite("Valid request conditions", () => {

        setup(() => {
          query = {
            caseId: "9"
          };

          for (let i = 0; i < 1; i++) {
            const s = new StepDbo();
            s.id = i;
            s.description = "Suite " + i;

            steps.push(s);
          }

          for (const step of steps) {
            supplierGetAllStepsResponse.push({
              id: step.id.toString(),
              description: step.description
            });
          }
        });

        test("A list of steps is returned in response body", async () => {
          given_Request_user_is(user);
          given_Request_query_is(query);
          given_stepRepository_getStepsForCase_returns_whenGiven(steps, query.caseId);

          await subject.getStepsForCase(req.object, res.object);

          res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, supplierGetAllStepsResponse))), Times.once());
        });

        test("Response returns statusCode 200", async () => {
          given_Request_user_is(user);
          given_Request_query_is(query);
          given_stepRepository_getStepsForCase_returns_whenGiven(steps, query.caseId);

          await subject.getStepsForCase(req.object, res.object);

          res.verify(r => r.status(OK), Times.once());
        });
      });

      suite("Unexpected 'Error' thrown by stepRepository", () => {

        setup(() => {
          query = {
            caseId: "9"
          };
        });

        test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} returned in errors array`, async () => {
          given_Request_user_is(user);
          given_Request_query_is(query);
          given_stepRepository_getStepsForCase_throws();

          await subject.getStepsForCase(req.object, res.object);

          res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
        });

        test("Response returns statusCode 500", async () => {
          given_Request_user_is(user);
          given_Request_query_is(query);
          given_stepRepository_getStepsForCase_throws();

          await subject.getStepsForCase(req.object, res.object);

          res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
        });
      });
    });

    suite("As Client", () => {
      let stepFeedback: StepFeedbackDbo;

      setup(() => {
        user = {
          email: "xy@me.com",
          type: "Client"
        };
      });

      suite("Valid request conditions", () => {
        setup(() => {
          query = {
            caseId: "9"
          };

          for (let i = 0; i < 1; i++) {
            const s = new StepDbo();
            s.id = i;
            s.description = "Suite " + i;

            steps.push(s);
          }

          stepFeedback = new StepFeedbackDbo();
          stepFeedback.notes = "notes !";
          stepFeedback.status = { id: 4, label: StepStatus.PASSED };
          stepFeedback.user = new UserDbo();
          stepFeedback.step = new StepDbo();

          for (const step of steps) {
            clientGetAllStepsResponse.push({
              id: step.id.toString(),
              description: step.description,
              currentStatus: {
                id: stepFeedback.status.id.toString(),
                label: stepFeedback.status.label
              }
            });
          }
        });

        test("Response body returns array of steps with latest feedback status", async () => {
          given_Request_user_is(user);
          given_Request_query_is(query);
          given_stepRepository_getStepsForCase_returns_whenGiven(steps, query.caseId);
          given_stepStatusRepository_getStatusByLabel_returns(stepFeedback.status);
          given_stepFeedbackRepository_getUserFeedbackForStep_returns([stepFeedback]);

          await subject.getStepsForCase(req.object, res.object);

          res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, clientGetAllStepsResponse))), Times.once());
        });

        test("Response returns status code 200", async () => {
          given_Request_user_is(user);
          given_Request_query_is(query);
          given_stepRepository_getStepsForCase_returns_whenGiven(steps, query.caseId);
          given_stepStatusRepository_getStatusByLabel_returns(stepFeedback.status);
          given_stepFeedbackRepository_getUserFeedbackForStep_returns([stepFeedback]);

          await subject.getStepsForCase(req.object, res.object);

          res.verify(r => r.status(OK), Times.once());
        });
      });
    });
  });

  suite("Update Step", () => {
    let updateStepBody: IUpdateStepRequest;

    let originalStep: StepDbo;
    let updatedStep: StepDbo;
    let updatedStepResponse: IStepResponse;

    suite("Valid request conditions", () => {

      setup(() => {
        updateStepBody = {
          description: "New Description"
        };

        originalStep = new StepDbo();
        originalStep.description = "Original description...";
        originalStep.id = 4;

        updatedStep = new StepDbo();
        updatedStep.description = updateStepBody.description!;
        updatedStep.id = 4;

        updatedStepResponse = {
          description: updatedStep.description,
          id: updatedStep.id.toString()
        };
      });

      test("Returns updated case in response payload", async () => {
        test("Saved step is returned in response body", async () => {
          given_Request_body_is(updateStepBody);
          given_stepRepository_getStepById_returns(originalStep);
          given_stepRepository_updateStep_returns(updatedStep);

          await subject.addStepToCase(req.object, res.object);

          res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, updatedStepResponse))), Times.once());
        });
      });

      test("Returns statusCode 200 in response", async () => {
        test("Saved step is returned in response body", async () => {
          given_Request_body_is(updateStepBody);
          given_stepRepository_getStepById_returns(originalStep);
          given_stepRepository_updateStep_returns(updatedStep);

          await subject.addStepToCase(req.object, res.object);

          res.verify(r => r.status(OK), Times.once());
        });
      });

    });

    suite("Suite could not be found", () => {

      setup(() => {
        updateStepBody = {
          description: "New Description"
        };
      });

      test("Error 'Error finding step' returned in errors array", async () => {
        given_Request_body_is(updateStepBody);
        given_stepRepository_getStepById_returns(undefined);

        await subject.updateStep(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, ["Error finding step"]))), Times.once());
      });

      test("Response returns statusCode 400", async () => {
        given_Request_body_is(updateStepBody);
        given_stepRepository_getStepById_returns(undefined);

        await subject.updateStep(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });

    });

    suite("Unexpected 'Error' thrown by stepRepository getStepById", () => {

      setup(() => {
        updateStepBody = {
          description: "New Description"
        };
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} returned in errors array`, async () => {
        given_Request_body_is(updateStepBody);
        given_stepRepository_getStepById_throws();

        await subject.updateStep(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(updateStepBody);
        given_stepRepository_getStepById_throws();

        await subject.updateStep(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by stepRepository updateStep", () => {

      setup(() => {
        updateStepBody = {
          description: "New Description"
        };

        originalStep = new StepDbo();
        originalStep.description = "Original description...";
        originalStep.id = 3;
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} returned in errors array`, async () => {
        given_Request_body_is(updateStepBody);
        given_stepRepository_getStepById_returns(originalStep);
        given_stepRepository_updateStep_throws();

        await subject.updateStep(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(updateStepBody);
        given_stepRepository_getStepById_returns(originalStep);
        given_stepRepository_updateStep_throws();

        await subject.updateStep(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("Delete Step", () => {

    let deleteStepParams: any;

    suite("Valid request conditions", () => {

      setup(() => {
        deleteStepParams = {
          id: "5"
        };
      });

      test("Response returns no payload", async () => {
        given_Request_params_are(deleteStepParams);
        given_stepRepository_deleteStepById_returns(undefined);

        await subject.deleteStep(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.payload === undefined)), Times.once());
      });

      test("Response returns statusCode 200", async () => {
        given_Request_params_are(deleteStepParams);
        given_stepRepository_deleteStepById_returns(undefined);

        await subject.deleteStep(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by stepRepository", () => {

      setup(() => {
        deleteStepParams = {
          id: "1"
        };
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}`, async () => {
        given_Request_params_are(deleteStepParams);
        given_stepRepository_deleteStepById_throws();

        await subject.deleteStep(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_params_are(deleteStepParams);
        given_stepRepository_deleteStepById_throws();

        await subject.deleteStep(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });

    });

  });


  function given_Request_body_is(body: any) {
    req
      .setup(r => r.body)
      .returns(() => body);
  }

  function given_stepRepository_addStepForCase_returns(step: StepDbo) {
    stepRepository
      .setup(sr => sr.addStepForCase(It.isAny(), It.isAny()))
      .returns(async () => step);
  }
  function given_stepRepository_addStepForCase_throws() {
    stepRepository
      .setup(sr => sr.addStepForCase(It.isAny(), It.isAny()))
      .throws(new Error("Sensitive database inforamtion could be leaked here!"));
  }

  function given_stepRepository_getStepsForCase_returns(steps: StepDbo[]) {
    stepRepository
      .setup(sr => sr.getStepsForCase(It.isAny()))
      .returns(async () => steps);
  }

  function given_stepRepository_getStepsForCase_returns_whenGiven(steps: StepDbo[], whenGiven: any) {
    stepRepository
      .setup(sr => sr.getStepsForCase(whenGiven))
      .returns(async () => steps);
  }

  function given_stepRepository_getStepsForCase_throws() {
    stepRepository
      .setup(sr => sr.getStepsForCase(It.isAny()))
      .throws(new Error("Sensitive database information!"));
  }

  function given_stepRepository_getStepById_returns(step: StepDbo | undefined) {
    stepRepository
      .setup(sr => sr.getStepById(It.isAny()))
      .returns(async () => step);
  }

  function given_stepRepository_updateStep_returns(step: StepDbo) {
    stepRepository
      .setup(sr => sr.updateStep(It.isAny()))
      .returns(async () => step);
  }
  function given_stepRepository_getStepById_throws() {
    stepRepository
      .setup(sr => sr.getStepById(It.isAny()))
      .throws(new Error("Sensetive database information!"));
  }

  function given_stepRepository_updateStep_throws() {
    stepRepository
      .setup(sr => sr.updateStep(It.isAny()))
      .throws(new Error("Sensetive database information!"));
  }

  function given_Request_params_are(params: any) {
    req
      .setup(r => r.params)
      .returns(() => params);
  }

  function given_Request_query_is(query: any) {
    req
      .setup(r => r.query)
      .returns(() => query);
  }

  function given_Request_user_is(user: IUserToken) {
    req
      .setup(r => r.user)
      .returns(() => user);
  }

  function given_stepRepository_deleteStepById_returns(returns: any) {
    stepRepository
      .setup(sr => sr.deleteStepById(It.isAny()))
      .returns(async () => returns);
  }

  function given_stepRepository_deleteStepById_throws() {
    stepRepository
      .setup(sr => sr.deleteStepById(It.isAny()))
      .throws(new Error("Sensitive database information!"));
  }

  function given_stepFeedbackRepository_getUserFeedbackForStep_returns(returns: StepFeedbackDbo[]) {
    stepFeedbackRepository
      .setup(sfr => sfr.getUserFeedbackForStep(It.isAny(), It.isAny()))
      .returns(async () => returns);
  }

  function given_stepStatusRepository_getStatusByLabel_returns(returns: StepStatusDbo) {
    stepStatusRepository
      .setup(sfr => sfr.getStatusByLabel(It.isAny()))
      .returns(async () => returns);
  }
});