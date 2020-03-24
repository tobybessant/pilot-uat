import { IMock, Mock, It, Times } from "typemoq";

import { Request, Response } from "express";
import { StepController } from "../../src/controllers";
import StepRepository from "../../src/repositories/stepRepository";
import { ICreateStepRequest } from "../../src/dto/request/supplier/createStep";
import { StepDbo } from "../../src/database/entities/stepDbo";
import { IStepResponse } from "../../src/dto/response/supplier/step";
import { StepStatus, StepStatusDbo } from "../../src/database/entities/stepStatusDbo";
import { CaseRepository } from "../../src/repositories/caseRepository";
import { OK, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { BaseController } from "../../src/controllers/baseController";
import { IGetAllStepsRequest } from "../../src/dto/request/supplier/getAllSteps";

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
});