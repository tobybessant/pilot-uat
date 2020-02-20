import "mocha";
import { IMock, Mock, It, Times } from "typemoq";
import { AuthController } from "../../src/controllers/auth";
import { RepositoryService } from "../../src/database/repositories/repositoryservice";
import { Repository } from "typeorm";
import { User } from "../../src/database/entity/User";
import { Request, Response } from "express";
import { OK, BAD_REQUEST } from "http-status-codes";

suite("Auth Controller", () => {
  let userRepository: IMock<Repository<User>>;
  let repositoryService: IMock<RepositoryService>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: AuthController;

  suiteSetup(async () => {
    userRepository = Mock.ofType<Repository<User>>();
    repositoryService = Mock.ofType<RepositoryService>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    await setupDependencies();

    subject = new AuthController(repositoryService.object);
  });

  teardown(() => {
    userRepository.reset();
    repositoryService.reset();
    req.reset();
    res.reset();
  });

  suite("Create Account", async () => {

    suite("Valid request data", () => {
      test("Body returns email", async () => {
        const body = {
          email: "toby@me.com",
          password: "HorseBatteryStaple",
          firstName: "Toby"
        };


        given_Request_body_is(body);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.json({ email: body.email }), Times.once());
      });

      test("Status code is 200", async () => {
        const body = {
          email: "toby@me.com",
          password: "HorseBatteryStaple",
          firstName: "Toby"
        };
        given_Request_body_is(body);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("Invalid request data", () => {
      test("Body returns errors", async () => {
        const body = {
        };
        given_Request_body_is(body);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.json({ err: "Invalid data" }), Times.once());
      });

      test("Status code is 400", async () => {
        const body = {
        };
        given_Request_body_is(body);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });
  });

  // UTILITY / SETUP FUNCTIONS
  function setupDependencies() {
    userRepository
      .setup(u => u.findOne(It.isAny()))
      .returns(async () => new Promise<User>((resolve, reject) => {
        resolve({ email: "Test" } as User);
      }));

    repositoryService
      .setup(rs => rs.getRepositoryFor<User>(User))
      .returns(() => userRepository.object);
  }

  function given_Request_body_is(_body: any) {
    req
      .setup(r => r.body)
      .returns(() => _body);
  }

  function given_UserRepository_save_throws(ex: Error) {
    userRepository
      .setup(ur => ur.save(It.isAny()))
      .throws(ex);
  }

});


