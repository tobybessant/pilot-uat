import { IMock, Mock, It, Times } from "typemoq";
import { AuthController } from "../../src/controllers/auth";

import { assert } from "chai";
import { Request, Response } from "express";
import { CREATED, BAD_REQUEST } from "http-status-codes";
import { UserDbo } from "../../src/database/entities/userDbo";
import { UserTypeDbo } from "../../src/database/entities/userTypeDbo";
import { Bcrypt } from "../../src/services/utils/bcryptHash";
import { IUserResponse } from "../../src/dto/response/common/user";
import { UserRepository } from "../../src/repositories/userRepository";
import { UserTypeRepository } from "../../src/repositories/userTypeRepository";
import { OrganisationRepository } from "../../src/repositories/organisationRepository";
import { deepStrictEqual } from "../testUtils/deepStrictEqual";

suite("Auth Controller", () => {
  let userRepository: IMock<UserRepository>;
  let userTypeRepository: IMock<UserTypeRepository>;
  let organisationRepository: IMock<OrganisationRepository>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let bcrypt: IMock<Bcrypt>;
  let subject: AuthController;

  setup(() => {
    userRepository = Mock.ofType<UserRepository>();
    userTypeRepository = Mock.ofType<UserTypeRepository>();
    organisationRepository = Mock.ofType<OrganisationRepository>();
    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();
    bcrypt = Mock.ofType<Bcrypt>();

    subject = new AuthController(userRepository.object, userTypeRepository.object, organisationRepository.object,bcrypt.object);
  });

  teardown(() => {
    userRepository.reset();
    userTypeRepository.reset();
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
        };

        createUserResponse = {
          id: saveUserResponse.id,
          email: createUserBody.email,
          firstName: createUserBody.firstName,
          type: userType.type,
          createdDate: saveUserResponse.createdDate,
          lastName: createUserBody.lastName
        };
      });

      test("Body returns created user data", async () => {
        given_UserRepository_accountDoesExist_returns(false);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userType, It.isAny());
        given_userRepository_addUser_returns(saveUserResponse);
        given_Request_body_is(createUserBody);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.payload, createUserResponse))), Times.once());
      });

      test("Status code 201", async () => {
        given_UserRepository_accountDoesExist_returns(false);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userType, It.isAny());
        given_userRepository_addUser_returns(saveUserResponse);
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
          id: "XYZ ABC",
          email: createUserBody.email,
          passwordHash: bcrypt.object.hash(createUserBody.password),
          firstName: createUserBody.firstName,
          lastName: createUserBody.lastName,
          createdDate: new Date(),
          userType: userType as UserTypeDbo,
          organisations: [],
          projects: []
        };

        createUserResponse = {
          id: saveUserResponse.id,
          email: createUserBody.email,
          firstName: createUserBody.firstName,
          type: userType.type,
          createdDate: saveUserResponse.createdDate,
          lastName: createUserBody.lastName
        };
      });

      test("Body returns error 'Account already exists with that email'", async () => {
        given_UserRepository_accountDoesExist_returns(true);
        given_bcrypt_hash_returns_whenGiven(createUserBody.password, createUserBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userType as UserTypeDbo, It.isAny());
        given_userRepository_addUser_returns(saveUserResponse);
        given_Request_body_is(createUserBody);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.json(It.is(body =>
          deepStrictEqual(body.errors, ["Account already exists with that email"]))), Times.once());
      });

      test("Status code 400", async () => {
        given_UserRepository_accountDoesExist_returns(true);
        given_bcrypt_hash_returns_whenGiven(createUserBody.password, createUserBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userType, It.isAny());
        given_userRepository_addUser_returns(saveUserResponse);
        given_Request_body_is(createUserBody);

        await subject.createAccount(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });
  });

  function given_Request_body_is(_model: any): void {
    req
      .setup(r => r.body)
      .returns(() => _model);
  }

  function given_userTypeRepository_getTypeByType_returns_whenGiven(returns: UserTypeDbo, whenGiven: any) {
    userTypeRepository
      .setup(u => u.getTypeByType(whenGiven))
      .returns(async () => returns);
  }

  function given_UserRepository_accountDoesExist_returns(value: boolean): void {
    userRepository
      .setup(u => u.accountDoesExist(It.isAny()))
      .returns(async () => value);

  }

  function given_userRepository_addUser_returns(user: UserDbo): void {
    userRepository
      .setup(u => u.addUser(It.isAny()))
      .returns(async () => user);
  }

  function given_bcrypt_hash_returns_whenGiven(returns: string, whenGiven: string) {
    bcrypt
      .setup(b => b.hash(whenGiven))
      .returns(() => returns);
  }
});
