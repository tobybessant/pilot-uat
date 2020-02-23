import { IMock, Mock, It, Times } from "typemoq";
import { AuthController } from "../../src/controllers/auth";
import { RepositoryService } from "../../src/database/repositories/repositoryservice";
import { Repository } from "typeorm";
import { UserDbo } from "../../src/database/entity/User";
import { Request, Response } from "express";
import { CREATED } from "http-status-codes";

suite("Auth Controller", () => {
  let userRepository: IMock<Repository<UserDbo>>;
  let repositoryService: IMock<RepositoryService>;
  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: AuthController;

  suiteSetup(async () => {
    userRepository = Mock.ofType<Repository<UserDbo>>();
    repositoryService = Mock.ofType<RepositoryService>();
    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    given_RepositoryService_getRepositoryFor_returns_whenGiven(userRepository.object, UserDbo);

    subject = new AuthController(repositoryService.object);
  });

  teardown(() => {
    userRepository.reset();
    repositoryService.reset();
    req.reset();
    res.reset();
  });

  suite("Create Account", async () => {

    suite("Valid request conditions", () => {
      test("Body returns email", async () => {
        const createUser = {
          email: "toby@me.com",
          password: "CorrectHorseBatteryStaple",
          firstName: "Toby"
        };

        const createUserResponse = new UserDbo();
        createUserResponse.email = createUser.email;

        given_UserRepository_count_returns(0);
        given_UserRepository_save_returns(createUserResponse);
        given_Request_requestModel_is(createUser);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.json({ email: createUser.email }), Times.once());
      });

      test("Status code 201", async () => {
        const createUser = {
          email: "toby@me.com",
          password: "CorrectHorseBatteryStaple",
          firstName: "Toby"
        };

        const createUserResponse = new UserDbo();
        createUserResponse.email = createUser.email;

        given_UserRepository_count_returns(0);
        given_UserRepository_save_returns(createUserResponse);
        given_Request_requestModel_is(createUser);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.status(CREATED), Times.once());
      });

    });
  });


  function given_RepositoryService_getRepositoryFor_returns_whenGiven<T>(returns: Repository<T>, whenGiven: any): void {
    repositoryService
      .setup(rs => rs.getRepositoryFor<T>(whenGiven))
      .returns(() => returns);
  }

  function given_Request_requestModel_is(_model: any): void {
    req
      .setup(r => r.requestModel)
      .returns(() => JSON.stringify(_model));
  }

  function given_UserRepository_count_returns(value: any): void {
    userRepository
      .setup(u => u.count(It.isAny()))
      .returns(async () => value);
  }

  function given_UserRepository_save_returns(user: any): void {
    userRepository
      .setup(u => u.save(It.isAny()))
      .returns(async () => user);
  }

  function given_UserRepository_save_throws(ex: Error): void {
    userRepository
      .setup(ur => ur.save(It.isAny()))
      .throws(ex);
  }

});


