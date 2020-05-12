import { IMock, Mock, It, Times } from "typemoq";
import { Request, Response } from "express";
import { StepFeedbackRepository } from "../../src/repositories/stepFeedbackRepository";
import StepRepository from "../../src/repositories/stepRepository";
import { UserRepository } from "../../src/repositories/userRepository";
import { StepFeedbackController } from "../../src/controllers";
import { IUserToken } from "../../src/dto/response/common/userToken";
import { ICreateFeedbackRequest } from "../../src/dto/request/client/feedback.interface";
import { UserDbo } from "../../src/database/entities/userDbo";
import { StepDbo } from "../../src/database/entities/stepDbo";
import { StepFeedbackDbo } from "../../src/database/entities/stepFeedbackDbo";
import { StepStatus } from "../../src/database/entities/stepStatusDbo";
import { deepStrictEqual } from "../testUtils/deepStrictEqual";
import { IStepFeedbackResponse } from "../../src/dto/response/client/feedback";
import { CREATED, OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } from "http-status-codes";
import { IUserStepFeedbackResponse } from "../../src/dto/response/supplier/userStepFeedback";
import { BaseController } from "../../src/controllers/baseController";

suite("StepFeedbackController", () => {
  let stepFeedbackRepository: IMock<StepFeedbackRepository>;
  let stepRepository: IMock<StepRepository>;
  let userRepository: IMock<UserRepository>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: StepFeedbackController;

  setup(() => {
    stepFeedbackRepository = Mock.ofType<StepFeedbackRepository>();
    stepRepository = Mock.ofType<StepRepository>();
    userRepository = Mock.ofType<UserRepository>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    subject = new StepFeedbackController(userRepository.object, stepRepository.object, stepFeedbackRepository.object);
  });

  suite("Create step feedback", () => {
    let body: ICreateFeedbackRequest;
    let user: IUserToken;
    let createFeedbackResponse: IStepFeedbackResponse;
    let userDbo: UserDbo;
    let stepDbo: StepDbo;
    let stepFeedbackDbo: StepFeedbackDbo;

    suite("Valid request conditions", () => {
      setup(() => {
        user = {
          email: "email1@me.com",
          type: "Supplier"
        };

        userDbo = new UserDbo();
        userDbo.email = user.email;

        body = {
          notes: "note1",
          status: "Passed",
          stepId: "3"
        };

        stepDbo = new StepDbo();

        stepFeedbackDbo = new StepFeedbackDbo();
        stepFeedbackDbo.step = stepDbo;
        stepFeedbackDbo.id = 4;
        stepFeedbackDbo.user = userDbo;
        stepFeedbackDbo.notes = body.notes;
        stepFeedbackDbo.status = { label: StepStatus.PASSED, id: 43 };

        createFeedbackResponse = {
          createdDate: stepFeedbackDbo.createdDate,
          id: stepFeedbackDbo.id.toString(),
          notes: stepFeedbackDbo.notes,
          status: {
            id: stepFeedbackDbo.status.id.toString(),
            label: stepFeedbackDbo.status.label
          }
        };
      });

      test("Request body returns step data", async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(userDbo, user.email);
        given_stepRepository_getStepById_returns_whenGiven(stepDbo, body.stepId);
        given_stepFeedbackRepository_addStepFeedback_returns(stepFeedbackDbo);

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.json(It.is(b => deepStrictEqual(b.payload, createFeedbackResponse))), Times.once());
      });

      test("Request returns statusCode 201", async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(userDbo, user.email);
        given_stepRepository_getStepById_returns_whenGiven(stepDbo, body.stepId);
        given_stepFeedbackRepository_addStepFeedback_returns(stepFeedbackDbo);

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.status(CREATED), Times.once());
      });
    });

    suite("User is not found by userRepository getUserByEmail (returns undefined)", () => {

      setup(() => {
        body = {
          notes: "note1",
          status: "Passed",
          stepId: "3"
        };
      });

      test("Response returns 'User not found' in errors array", async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(undefined, user.email);

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.json(It.is(b => b.errors.includes("User not found"))), Times.once());
      });

      test("Response returns statusCode 400", async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(undefined, user.email);

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });

    suite("Step is not found by stepRepository getStepById (returns undefined)", () => {

      setup(() => {
        user = {
          email: "email1@me.com",
          type: "Supplier"
        };

        userDbo = new UserDbo();
        userDbo.email = user.email;

        body = {
          notes: "note1",
          status: "Passed",
          stepId: "3"
        };

      });

      test("Response returns 'Step not found' in errors array", async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(userDbo, user.email);
        given_stepRepository_getStepById_returns_whenGiven(undefined, body.stepId);

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.json(It.is(b => b.errors.includes("Step not found"))), Times.once());
      });

      test("Response returns statusCode 400", async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(userDbo, user.email);
        given_stepRepository_getStepById_returns_whenGiven(undefined, body.stepId);

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by userRepository getUserByEmail", () => {
      setup(() => {
        user = {
          email: "email1@me.com",
          type: "Supplier"
        };
      });

      test(`Generic ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} is returned in response errors array`, async () => {
        given_Request_user_is(user);
        given_userRepository_getUserByEmail_throws();

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_user_is(user);
        given_userRepository_getUserByEmail_throws();

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by stepRepository getStepById", () => {

      setup(() => {
        user = {
          email: "email1@me.com",
          type: "Supplier"
        };

        userDbo = new UserDbo();
        userDbo.email = user.email;

        body = {
          notes: "note1",
          status: "Passed",
          stepId: "3"
        };
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in errors array`, async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(userDbo, user.email);
        given_stepRepository_getStepById_throws();

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.json(It.is(b => b.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(userDbo, user.email);
        given_stepRepository_getStepById_throws();

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by stepFeedbackRepository addStepFeedback", () => {

      setup(() => {
        user = {
          email: "email1@me.com",
          type: "Supplier"
        };

        userDbo = new UserDbo();
        userDbo.email = user.email;

        body = {
          notes: "note1",
          status: "Passed",
          stepId: "3"
        };

        stepDbo = new StepDbo();

        stepFeedbackDbo = new StepFeedbackDbo();
        stepFeedbackDbo.step = stepDbo;
        stepFeedbackDbo.id = 4;
        stepFeedbackDbo.user = userDbo;
        stepFeedbackDbo.notes = body.notes;
        stepFeedbackDbo.status = { label: StepStatus.PASSED, id: 43 };

        createFeedbackResponse = {
          createdDate: stepFeedbackDbo.createdDate,
          id: stepFeedbackDbo.id.toString(),
          notes: stepFeedbackDbo.notes,
          status: {
            id: stepFeedbackDbo.status.id.toString(),
            label: stepFeedbackDbo.status.label
          }
        };
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in errors array`, async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(userDbo, user.email);
        given_stepRepository_getStepById_returns_whenGiven(stepDbo, body.stepId);
        given_stepFeedbackRepository_addStepFeedback_throws();

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.json(It.is(b => b.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_user_is(user);
        given_Request_body_is(body);
        given_userRepository_getUserByEmail_returns_whenGiven(userDbo, user.email);
        given_stepRepository_getStepById_returns_whenGiven(stepDbo, body.stepId);
        given_stepFeedbackRepository_addStepFeedback_throws();

        await subject.addStepFeedback(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("Get user feedback for step", () => {
    let query: any;
    let stepDbo: StepDbo;
    let user: UserDbo;
    const usersWithFeedback: UserDbo[] = [];
    let userFeedbackResponse: IUserStepFeedbackResponse[];
    const stepFeedback: StepFeedbackDbo[] = [];
    let allStepFeedbackForUserResponse: IStepFeedbackResponse[];
    let onlyLatestStepFeedbackForUserResponse: IStepFeedbackResponse;

    suite("No user email provided (fetching all feedback per user for a given step)", () => {

      setup(() => {
        query = {
          stepId: 6
        };

        stepDbo = new StepDbo();
        stepDbo.id = query.stepId;

        for (let i = 0; i < 3; i++) {
          const u = new UserDbo();
          u.id = i.toString();
          u.email = `user${i}@me.com`;
          u.firstName = `f${i}`;
          u.lastName = `l${i}`;
          u.createdDate = new Date();
          u.stepFeedback = [];

          for (let j = 0; j < 5; j++) {
            const fb = new StepFeedbackDbo();
            fb.id = j * 1000 * i + Math.random();
            fb.notes = "I am feedback no. " + j * i;
            fb.step = stepDbo;
            fb.status = { label: StepStatus.PASSED, id: 43 };
            u.stepFeedback.push(fb);
          }

          usersWithFeedback.push(u);
        }

        userFeedbackResponse = usersWithFeedback.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdDate: user.createdDate,
          feedback: user.stepFeedback.map(s => ({
            id: s.id.toString(),
            createdDate: s.createdDate,
            notes: s.notes,
            status: {
              id: s.status.id.toString(),
              label: s.status.label
            }
          }))
        }));
      });

      test("Response body returns array of users with corresponding step feedback", async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getAllUserFeedbackForStep_returns_whenGiven(usersWithFeedback, query.stepId);

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.json(It.is(b => deepStrictEqual(b.payload, userFeedbackResponse))), Times.once());
      });

      test("Response returns statusCode 200", async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getAllUserFeedbackForStep_returns_whenGiven(usersWithFeedback, query.stepId);

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });

    });

    suite("A userEmail is provided and onlyLatest is 'true'", () => {
      setup(() => {
        query = {
          stepId: 6,
          onlyLatest: true,
          userEmail: "hello@me.com"
        };

        stepDbo = new StepDbo();
        stepDbo.id = query.stepId;

        for (let i = 0; i < 4; i++) {
          const fb = new StepFeedbackDbo();
          fb.id = i;
          fb.createdDate = new Date(i);
          fb.notes = i + " note";
          fb.status = { id: 1, label: StepStatus.PASSED };
          fb.user = new UserDbo();
          fb.user.id = (i + 62 * i).toString();
          stepFeedback.push(fb);
        }

        onlyLatestStepFeedbackForUserResponse = {
          createdDate: stepFeedback[0].createdDate,
          id: stepFeedback[0].id.toString(),
          notes: stepFeedback[0].notes,
          status: {
            id: stepFeedback[0].status.id.toString(),
            label: stepFeedback[0].status.label
          },
          user: {
            createdDate: stepFeedback[0].user.createdDate,
            email: stepFeedback[0].user.email,
            firstName: stepFeedback[0].user.firstName,
            lastName: stepFeedback[0].user.lastName,
            id: stepFeedback[0].user.id
          }
        };

      });

      test("Response returns single stepFeedbackDbo information", async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getUserFeedbackForStep_returns_whenGiven(stepFeedback, [query.stepId, query.userEmail]);

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, onlyLatestStepFeedbackForUserResponse))), Times.once());
      });

      test("Response returns statusCode 200", async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getUserFeedbackForStep_returns_whenGiven(stepFeedback, [query.stepId, query.userEmail]);

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("A userEmail is provided and onlyLatest is 'false' or not provided", () => {
      setup(() => {
        query = {
          stepId: 6,
          onlyLatest: false,
          userEmail: "hello@me.com"
        };

        stepDbo = new StepDbo();
        stepDbo.id = query.stepId;

        user = new UserDbo();
        user.email = query.userEmail;
        user.id = "ASdfasdf";

        for (let i = 0; i < 4; i++) {
          const fb = new StepFeedbackDbo();
          fb.id = i;
          fb.createdDate = new Date(i);
          fb.notes = i + " note";
          fb.status = { id: 1, label: StepStatus.PASSED };
          fb.user = user;
          fb.user.id = (i + 62 * i).toString();
          stepFeedback.push(fb);
        }

        allStepFeedbackForUserResponse = stepFeedback.map(s => ({
          createdDate: s.createdDate,
          id: s.id.toString(),
          notes: s.notes,
          status: {
            id: s.status.id.toString(),
            label: s.status.label
          },
          user: {
            createdDate: s.user.createdDate,
            email: s.user.email,
            firstName: s.user.firstName,
            lastName: s.user.lastName,
            id: s.user.id
          }
        }));
      });

      test("Response returns list of all stepFeedbackDbos for this user and step", async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getUserFeedbackForStep_returns_whenGiven(stepFeedback, [query.stepId, query.userEmail]);

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, allStepFeedbackForUserResponse))), Times.once());
      });

      test("Response returns statusCode 200", async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getUserFeedbackForStep_returns_whenGiven(stepFeedback, [query.stepId, query.userEmail]);

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by stepFeedbackRepository getAllUserFeedbackForStep", () => {
      setup(() => {
        query = {
          stepId: 6
        };
      });

      test(`Response returns generic ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in errors array`, async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getAllUserFeedbackForStep_throws();

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.json(It.is(b => b.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getAllUserFeedbackForStep_throws();

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by stepFeedbackRepository getUserFeedbackForStep", () => {
      setup(() => {
        query = {
          stepId: 6,
          userEmail: "test@me.com"
        };
      });

      test(`Response returns generic ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in errors array`, async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getUserFeedbackForStep_throws();

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.json(It.is(b => b.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_query_is(query);
        given_stepFeedbackRepository_getAllUserFeedbackForStep_throws();

        await subject.getLatestUserFeedbackForStep(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  function given_Request_user_is(user: IUserToken) {
    req
      .setup(r => r.user)
      .returns(() => user);
  }

  function given_Request_body_is(body: any) {
    req
      .setup(r => r.body)
      .returns(() => body);
  }

  function given_Request_query_is(query: any) {
    req
      .setup(r => r.query)
      .returns(() => query);
  }

  function given_userRepository_getUserByEmail_returns_whenGiven(returns: UserDbo | undefined, whenGiven: string) {
    userRepository
      .setup(u => u.getUserByEmail(whenGiven))
      .returns(async () => returns);
  }

  function given_stepRepository_getStepById_returns_whenGiven(returns: StepDbo | undefined, whenGiven: string) {
    stepRepository
      .setup(s => s.getStepById(whenGiven))
      .returns(async () => returns);
  }

  function given_stepFeedbackRepository_addStepFeedback_returns(returns: StepFeedbackDbo) {
    stepFeedbackRepository
      .setup(s => s.addStepFeedback(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
      .returns(async () => returns);
  }

  function given_stepFeedbackRepository_getAllUserFeedbackForStep_returns_whenGiven(returns: UserDbo[], whenGiven: string) {
    stepFeedbackRepository
      .setup(s => s.getAllUserFeedbackForStep(whenGiven))
      .returns(async () => returns);
  }

  function given_stepFeedbackRepository_getUserFeedbackForStep_returns_whenGiven(returns: StepFeedbackDbo[], whenGiven: string[]) {
    stepFeedbackRepository
      .setup(s => s.getUserFeedbackForStep(whenGiven[0], whenGiven[1]))
      .returns(async () => returns);
  }

  function given_userRepository_getUserByEmail_throws() {
    userRepository
      .setup(u => u.getUserByEmail)
      .throws(new Error("Database information here"));
  }

  function given_stepRepository_getStepById_throws() {
    stepRepository
      .setup(s => s.getStepById(It.isAny()))
      .throws(new Error("Database information"));
  }

  function given_stepFeedbackRepository_addStepFeedback_throws() {
    stepFeedbackRepository
      .setup(s => s.addStepFeedback(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
      .throws(new Error("Database information"));
  }

  function given_stepFeedbackRepository_getAllUserFeedbackForStep_throws() {
    stepFeedbackRepository
      .setup(s => s.getAllUserFeedbackForStep(It.isAny()))
      .throws(new Error("Database information"));
  }

  function given_stepFeedbackRepository_getUserFeedbackForStep_throws() {
    stepFeedbackRepository
      .setup(s => s.getUserFeedbackForStep(It.isAny(), It.isAny()))
      .throws(new Error("Database information"));
  }
});
