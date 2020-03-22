import { IMock, Mock, It, Times } from "typemoq";
import { AuthController } from "../../src/controllers/auth";

import { Repository } from "typeorm";
import { RepositoryService } from "../../src/services/repositoryService";

import { Request, Response } from "express";
import { CREATED, BAD_REQUEST } from "http-status-codes";
import { UserDbo } from "../../src/database/entities/userDbo";
import { UserTypeDbo } from "../../src/database/entities/userTypeDbo";
import { Bcrypt } from "../../src/services/utils/bcryptHash";
import { IUserResponse } from "../../src/dto/response/common/user";
import { OrganisationDbo } from "../../src/database/entities/organisationDbo";

suite("Auth Controller", () => {
  let userRepository: IMock<Repository<UserDbo>>;
  let userTypeRepository: IMock<Repository<UserTypeDbo>>;
  let organisationRepository: IMock<Repository<OrganisationDbo>>;

  let repositoryService: IMock<RepositoryService>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let bcrypt: IMock<Bcrypt>;
  let subject: AuthController;

  setup(() => {
    userRepository = Mock.ofType<Repository<UserDbo>>();
    userTypeRepository = Mock.ofType<Repository<UserTypeDbo>>();
    organisationRepository = Mock.ofType<Repository<OrganisationDbo>>();
    repositoryService = Mock.ofType<RepositoryService>();
    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();
    bcrypt = Mock.ofType<Bcrypt>();

    // setup mock repository to return requested repositories
    given_RepositoryService_getRepositoryFor_returns_whenGiven(userRepository.object, UserDbo);
    given_RepositoryService_getRepositoryFor_returns_whenGiven(userTypeRepository.object, UserTypeDbo);
    given_RepositoryService_getRepositoryFor_returns_whenGiven(organisationRepository.object, OrganisationDbo);

    subject = new AuthController(repositoryService.object, bcrypt.object);
  });

  teardown(() => {
    userRepository.reset();
    userTypeRepository.reset();
    repositoryService.reset();
    req.reset();
    res.reset();
  });

  suite("Create Account", async () => {

    suite("Valid request conditions", () => {
      let createUserBody: any;
      let userType: UserTypeDbo;
      let saveUserResponse: UserDbo;
      let createUserResponse: IUserResponse;

      setup(() => {
        createUserBody = {
          email: "toby@me.com",
          password: "CorrectHorseBatteryStaple",
          firstName: "Toby",
          lastName: "B"
        };

        userType = {
          id: 1,
          type: "Supplier"
        };

        saveUserResponse = {
          id: "XYZ-ABC",
          email: createUserBody.email,
          passwordHash: bcrypt.object.hash(createUserBody.password),
          firstName: createUserBody.firstName,
          lastName: createUserBody.lastName,
          createdDate: new Date(),
          userType: userType as UserTypeDbo,
          organisations: [],
          projects: []
        }

        createUserResponse = {
          email: createUserBody.email,
          firstName: createUserBody.firstName,
          type: userType.type,
          createdDate: saveUserResponse.createdDate,
          lastName: createUserBody.lastName,
          organisations: saveUserResponse.organisations
        }
      });

      test("Body returns created user data", async () => {
        given_UserRepository_count_returns(0);
        given_userTypeRepository_findOne_returns_whenGiven(userType, It.isAny());
        given_UserRepository_save_returns(saveUserResponse);
        given_Request_body_is(createUserBody);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.json({
          errors: [],
          payload: createUserResponse
        }), Times.once());
      });

      test("Status code 201", async () => {
        given_UserRepository_count_returns(0);
        given_userTypeRepository_findOne_returns_whenGiven(userType, It.isAny());
        given_UserRepository_save_returns(saveUserResponse);
        given_Request_body_is(createUserBody);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.status(CREATED), Times.once());
      });
    });

    suite("Account already exists with email provided", async () => {
      let createUserBody: any;
      let userType: UserTypeDbo;
      let saveUserResponse: UserDbo;
      let createUserResponse: IUserResponse;

      setup(() => {
        createUserBody = {
          email: "toby@me.com",
          password: "CorrectHorseBatteryStaple",
          firstName: "Toby",
          lastName: "B"
        };

        userType = {
          id: 1,
          type: "Supplier"
        };

        saveUserResponse = {
          id: "XYZ-ABC",
          email: createUserBody.email,
          passwordHash: bcrypt.object.hash(createUserBody.password),
          firstName: createUserBody.firstName,
          lastName: createUserBody.lastName,
          createdDate: new Date(),
          userType: userType as UserTypeDbo,
          organisations: [],
          projects: []
        }

        createUserResponse = {
          email: createUserBody.email,
          firstName: createUserBody.firstName,
          type: userType.type,
          createdDate: saveUserResponse.createdDate,
          lastName: createUserBody.lastName,
          organisations: saveUserResponse.organisations
        }
      });

      test("Body returns error 'Account already exists with that email'", async () => {
        given_UserRepository_count_returns(1);
        given_bcrypt_hash_returns_whenGiven(createUserBody.password, createUserBody.password);
        given_userTypeRepository_findOne_returns_whenGiven(userType as UserTypeDbo, It.isAny());
        given_UserRepository_save_returns(saveUserResponse);
        given_Request_body_is(createUserBody);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.json({ errors: ["Account already exists with that email"] }), Times.once());
      });

      test("Status code 400", async () => {
        given_UserRepository_count_returns(1);
        given_bcrypt_hash_returns_whenGiven(createUserBody.password, createUserBody.password);
        given_userTypeRepository_findOne_returns_whenGiven(userType, It.isAny());
        given_UserRepository_save_returns(saveUserResponse);
        given_Request_body_is(createUserBody);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });
  });

  function given_RepositoryService_getRepositoryFor_returns_whenGiven<T>(returns: Repository<T>, whenGiven: any): void {
    repositoryService
      .setup(rs => rs.getRepositoryFor<T>(whenGiven))
      .returns(() => returns);
  }

  function given_Request_body_is(_model: any): void {
    req
      .setup(r => r.body)
      .returns(() => _model);
  }

  function given_userTypeRepository_findOne_returns_whenGiven(returns: UserTypeDbo, whenGiven: any) {
    userTypeRepository
      .setup(u => u.findOne(whenGiven))
      .returns(async () => returns);
  }

  function given_UserRepository_count_returns(value: any): void {
    userRepository
      .setup(u => u.count(It.isAny()))
      .returns(async () => value);
  }

  function given_UserRepository_save_returns(user: UserDbo): void {
    userRepository
      .setup(u => u.save(It.isAny()))
      .returns(async () => user);
  }

  function given_bcrypt_hash_returns_whenGiven(returns: string, whenGiven: string) {
    bcrypt
      .setup(b => b.hash(whenGiven))
      .returns(() => returns);
  }
});


