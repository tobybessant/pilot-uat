import { IMock, Mock, It, Times } from "typemoq";

import { Request, Response } from "express";
import { StepController } from "../../src/controllers";
import StepRepository from "../../src/repositories/stepRepository";
import { ICreateStepRequest } from "../../src/dto/request/supplier/createStep";
import { StepDbo } from "../../src/database/entities/stepDbo";
import { IStepResponse } from "../../src/dto/response/supplier/step";
import { StepStatus, StepStatusDbo } from "../../src/database/entities/stepStatusDbo";
import { CaseRepository } from "../../src/repositories/caseRepository";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from "http-status-codes";
import { BaseController } from "../../src/controllers/baseController";
import { IGetAllStepsRequest } from "../../src/dto/request/supplier/getAllSteps";
import { IUpdateStepRequest } from "../../src/dto/request/supplier/updateStep";

suite("Step Controller", () => {
  let stepRepository: IMock<StepRepository>;
  let caseRepository: IMock<CaseRepository>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: StepController;

  setup(() => {
    stepRepository = Mock.ofType<StepRepository>();
    caseRepository = Mock.ofType<CaseRepository>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    subject = new StepController(stepRepository.object);
  });

  suite("Add Step to Test Case", () => {
    let addStepBody: ICreateStepRequest;
    let stepStatus: StepStatusDbo;
    let createdStep: StepDbo;
    let createdStepResponse: IStepResponse;

    suite("Valid request conditions", () => {

      setup(() => {
        addStepBody = {
          caseId: "4",
          description: "I am a new test step!"
        };

        stepStatus = new StepStatusDbo();
        stepStatus.id = 1;
        stepStatus.label = StepStatus.NOT_STARTED;

        createdStep = new StepDbo();
        createdStep.description = addStepBody.description;
        createdStep.id = 3
        createdStep.status = stepStatus;

        createdStepResponse = {
          description: createdStep.description,
          id: createdStep.id.toString(),
          status: {
            id: createdStep.status.id.toString(),
            label: createdStep.status.label
          }
        }
      });

      test("Saved step is returned in response body", async () => {
        given_Request_body_is(addStepBody);
        given_stepRepository_addStepForCase_returns(createdStep);

        await subject.addStepToCase(req.object, res.object);

        res.verify(r => r.json({ errors: [], payload: createdStepResponse }), Times.once());
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
        }
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} is returned in errors array`, async () => {
        given_Request_body_is(addStepBody);
        given_stepRepository_addStepForCase_throws();

        await subject.addStepToCase(req.object, res.object);

        res.verify(r => r.json({ errors: [BaseController.INTERNAL_SERVER_ERROR_MESSAGE] }), Times.once());
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
    let getStepsBody: IGetAllStepsRequest;
    let stepStatus: StepStatusDbo;
    const steps: StepDbo[] = [];

    const getAllStepsResponse: IStepResponse[] = [];

    suite("Valid request conditions", () => {

      setup(() => {
        getStepsBody = {
          caseId: "9"
        };

        stepStatus = new StepStatusDbo();
        stepStatus.id = 2;
        stepStatus.label = StepStatus.PASSED;

        for (let i = 0; i < 1; i++) {
          const s = new StepDbo();
          s.id = i;
          s.description = "Suite " + i;
          s.status = stepStatus;
          steps.push(s);
        }

        for (const step of steps) {
          getAllStepsResponse.push({
            id: step.id.toString(),
            description: step.description,
            status: {
              id: step.status.id.toString(),
              label: step.status.label
            }
          });
        }
      });

      test("A list of steps is returned in response body", async () => {
        given_Request_body_is(getStepsBody);
        given_stepRepository_getStepsForCase_returns(steps);

        await subject.getStepsForCase(req.object, res.object);

        res.verify(r => r.json({ errors: [], payload: getAllStepsResponse }), Times.once());
      });

      test("Response returns statusCode 200", async () => {
        given_Request_body_is(getStepsBody);
        given_stepRepository_getStepsForCase_returns(steps);

        await subject.getStepsForCase(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by stepRepository", () => {

      setup(() => {
        getStepsBody = {
          caseId: "9"
        };
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} is returned in response errors array`, async () => {
        given_Request_body_is(getStepsBody);
        given_stepRepository_getStepsForCase_throws();

        await subject.getStepsForCase(req.object, res.object);

        res.verify(r => r.json({ errors: [BaseController.INTERNAL_SERVER_ERROR_MESSAGE] }), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(getStepsBody);
        given_stepRepository_getStepsForCase_throws();

        await subject.getStepsForCase(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("Update Step", () => {
    let updateStepBody: IUpdateStepRequest;

    let stepStatus: StepStatusDbo;
    let originalStep: StepDbo;
    let updatedStep: StepDbo;
    let updatedStepResponse: IStepResponse;

    suite("Valid request conditions", () => {

      setup(() => {
        updateStepBody = {
          id: "4",
          description: "New Description"
        };

        stepStatus = new StepStatusDbo();
        stepStatus.id = 90;
        stepStatus.label = StepStatus.PASSED;

        originalStep = new StepDbo();
        originalStep.description = "Original description...";
        originalStep.id = Number(updateStepBody.id);
        originalStep.status = stepStatus;

        updatedStep = new StepDbo();
        updatedStep.description = updateStepBody.description!;
        updatedStep.id = Number(updateStepBody.id);
        updatedStep.status = stepStatus;

        updatedStepResponse = {
          description: updatedStep.description,
          id: updatedStep.id.toString(),
          status: {
            id: updatedStep.status.id.toString(),
            label: updatedStep.status.label
          }
        }
      });

      test("Returns updated case in response payload", async () => {
        test("Saved step is returned in response body", async () => {
          given_Request_body_is(updateStepBody);
          given_stepRepository_getStepById_returns(originalStep);
          given_stepRepository_updateStep_returns(updatedStep);

          await subject.addStepToCase(req.object, res.object);

          res.verify(r => r.json({ errors: [], payload: updatedStepResponse }), Times.once());
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
          id: "4",
          description: "New Description"
        };
      });

      test("Error 'Error finding step' returned in errors array", async () => {
        given_Request_body_is(updateStepBody);
        given_stepRepository_getStepById_returns(undefined);

        await subject.updateStep(req.object, res.object);

        res.verify(r => r.json({ errors: ["Error finding step"] }), Times.once());
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
          id: "4",
          description: "New Description"
        };
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} returned in errors array`, async () => {
        given_Request_body_is(updateStepBody);
        given_stepRepository_getStepById_throws();

        await subject.updateStep(req.object, res.object);

        res.verify(r => r.json({ errors: [BaseController.INTERNAL_SERVER_ERROR_MESSAGE] }), Times.once());
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
          id: "4",
          description: "New Description"
        };

        stepStatus = new StepStatusDbo();
        stepStatus.id = 90;
        stepStatus.label = StepStatus.PASSED;

        originalStep = new StepDbo();
        originalStep.description = "Original description...";
        originalStep.id = Number(updateStepBody.id);
        originalStep.status = stepStatus;
      });

      test(`Generic error ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} returned in errors array`, async () => {
        given_Request_body_is(updateStepBody);
        given_stepRepository_getStepById_returns(originalStep);
        given_stepRepository_updateStep_throws();

        await subject.updateStep(req.object, res.object);

        res.verify(r => r.json({ errors: [BaseController.INTERNAL_SERVER_ERROR_MESSAGE] }), Times.once());
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


      test("Response returns only empty errors array", async () => {
        given_Request_params_are(deleteStepParams);
        given_stepRepository_deleteStepById_returns(undefined);

        await subject.deleteStep(req.object, res.object);

        res.verify(r => r.json({ errors: [] }), Times.once());
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

        res.verify(r => r.json({ errors: [BaseController.INTERNAL_SERVER_ERROR_MESSAGE] }), Times.once());
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
});