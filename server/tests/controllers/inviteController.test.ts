import { IMock, Mock, It, Times } from "typemoq";
import { deepStrictEqual } from "../testUtils/deepStrictEqual";
import { Request, Response } from "express";
import { InviteController } from "../../src/controllers";
import { InviteService } from "../../src/services/invite/inviteService";
import { ProjectRepository } from "../../src/repositories/projectRepository";
import { UserRepository } from "../../src/repositories/userRepository";
import { ProjectInviteRepository } from "../../src/repositories/projectInviteRepository";
import { Bcrypt } from "../../src/services/utils/bcryptHash";
import { UserTypeRepository } from "../../src/repositories/userTypeRepository";
import { ProjectInviteDbo } from "../../src/database/entities/projectInviteDbo";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, GONE } from "http-status-codes";
import { BaseController } from "../../src/controllers/baseController";
import { IProjectInviteToken } from "../../src/dto/request/common/inviteToken";
import { ApiError } from "../../src/services/apiError";
import { ISetupAccountRequest } from "../../src/dto/request/common/setupAccount";
import { UserTypeDbo } from "../../src/database/entities/userTypeDbo";
import { UserDbo } from "../../src/database/entities/userDbo";
import { UserProjectRoleDbo } from "../../src/database/entities/userProjectRoleDbo";
import { IUserToken } from "../../src/dto/response/common/userToken";

suite("InviteController", () => {
  let inviteService: IMock<InviteService>;
  let projectInviteRepository: IMock<ProjectInviteRepository>;
  let userRepository: IMock<UserRepository>;
  let projectRepository: IMock<ProjectRepository>;
  let userTypeRepository: IMock<UserTypeRepository>;
  let bcrypt: IMock<Bcrypt>;

  let req: IMock<Request>;
  let res: IMock<Response>;

  let subject: InviteController;

  setup(() => {
    inviteService = Mock.ofType<InviteService>();
    projectInviteRepository = Mock.ofType<ProjectInviteRepository>();
    userRepository = Mock.ofType<UserRepository>();
    projectRepository = Mock.ofType<ProjectRepository>();
    userTypeRepository = Mock.ofType<UserTypeRepository>();
    bcrypt = Mock.ofType<Bcrypt>();

    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();

    subject = new InviteController(inviteService.object,
      projectInviteRepository.object,
      userRepository.object,
      projectRepository.object,
      userTypeRepository.object,
      bcrypt.object);

  });

  suite("inviteClient", async () => {
    let inviteRequestBody: any;
    let inviteDbo: ProjectInviteDbo;
    let userProjectRole: UserProjectRoleDbo;
    let requestUser: IUserToken;

    suite("Valid request conditions", () => {
      setup(() => {
        inviteRequestBody = {
          projectId: 10,
          emails: [
            "hello@me.com",
            "email2@mailer.com"
          ]
        };
      });

      test("Should return nothing in response payload", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.payload === undefined)), Times.once());
      });

      test("Should return statusCode 200", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });

      test("Should create new invite for each email", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        projectInviteRepository.verify(p => p.createInvite(It.isAny()), Times.exactly(inviteRequestBody.emails.length));
      });

      test("Should send invite to each email", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        inviteService.verify(i => i.inviteClient(It.isAny(), It.isAny()), Times.exactly(inviteRequestBody.emails.length));
      });
    });

    suite("One of the emails invited has an existing invite", () => {
      setup(() => {
        inviteRequestBody = {
          projectId: 10,
          emails: [
            "hello@me.com",
            "email2@mailer.com"
          ]
        };

        inviteDbo = new ProjectInviteDbo();
        inviteDbo.userEmail = inviteRequestBody.emails[0];
      });

      test("Response returns 'One or more emails has an existing invite or is already in this project' in response errors array", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([inviteDbo], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes("One or more emails has an existing invite or is already in this project"))), Times.once());
      });

      test("Response returns statusCode 400", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([inviteDbo], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });


    });

    suite("One of the emails invited is already in this project", () => {

      setup(() => {
        inviteRequestBody = {
          projectId: 10,
          emails: [
            "hello@me.com",
            "email2@mailer.com"
          ]
        };

        userProjectRole = new UserProjectRoleDbo();
        userProjectRole.user = {
          email: inviteRequestBody.emails[0]
        } as unknown as UserDbo;
      });
      test("Response returns 'One or more emails has an existing invite or is already in this project' in response errors array", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([userProjectRole], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes("One or more emails has an existing invite or is already in this project"))), Times.once());
      });

      test("Response returns statusCode 400", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([userProjectRole], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });

    suite("User is trying to invite themself to the project", () => {
      setup(() => {
        requestUser = {
          email: "hello@me.com",
          type: "Supplier"
        };

        inviteRequestBody = {
          projectId: 10,
          emails: [
            requestUser.email,
            "email2@mailer.com"
          ]
        };

        userProjectRole = new UserProjectRoleDbo();
        userProjectRole.user = {
          email: inviteRequestBody.emails[0]
        } as unknown as UserDbo;
      });

      test("Response returns 'You cannot invite yourself to this project' in errors array", async () => {
        given_Request_user_is(requestUser);
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes("You cannot invite yourself to this project"))), Times.once());
      });

      test("Response returns statusCode 400", async () => {
        given_Request_user_is(requestUser);
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_inviteService_inviteClient_does_not_throw();
        given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven([], inviteRequestBody.projectId);
        given_projectRepository_getUsersForProject_returns_whenGiven([], inviteRequestBody.projectId);

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectInviteRepository", () => {

      setup(() => {
        inviteRequestBody = {
          projectId: 10,
          emails: [
            "hello@me.com",
            "email2@mailer.com"
          ]
        };
      });

      test(`Response errors contains generic '${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}' error message`, async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_throws();

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_throws();

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by inviteService", () => {

      setup(() => {
        inviteRequestBody = {
          projectId: 10,
          emails: [
            "hello@me.com",
            "email2@mailer.com"
          ]
        };
      });

      test(`Response errors contains generic '${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}' error message`, async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_projectInviteRepository_createInvite_throws();

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.json(It.is(body => deepStrictEqual(body.errors, [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(inviteRequestBody);
        given_projectInviteRepository_createInvite_returns_new_invite();
        given_projectInviteRepository_createInvite_throws();

        await subject.inviteClient(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("inviteResponse", () => {
    let token: string;
    let decodedToken: IProjectInviteToken;
    let projectInviteDbo: ProjectInviteDbo;

    suite("Valid request conditions (new user with no existing account)", () => {

      setup(() => {
        token = "hello-token";

        decodedToken = {
          id: "1330"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 1330;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test("Redirects to '/setup'", async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_userRepository_accountDoesExist_returns(false);

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.redirect(It.is(url => url.includes("/setup"))), Times.once());
      });

      test("Redirect url contains invite token in 't' url parameter", async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_userRepository_accountDoesExist_returns(false);

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.redirect(It.is(url => url.includes(`t=${token}`))), Times.once());
      });
    });

    suite("Valid request conditions (existing user with an account)", () => {

      setup(() => {
        token = "hello-token";

        decodedToken = {
          id: "1330"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 1330;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test("Redirects to 'accept/:token'", async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_userRepository_accountDoesExist_returns(true);

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.redirect(It.is(url => url.includes(`accept/${token}`))), Times.once());
      });
    });

    suite("Invite not found by projectInviteRepository", () => {
      setup(() => {
        token = "hello-token";

        decodedToken = {
          id: "1330"
        };
      });

      test("Response is redirected to error page", async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(undefined, decodedToken.id);

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.redirect(It.is(url => url.includes("/error"))), Times.once());
      });

      test("Redirect error message 'm' url parameter list contains 'Invite does not exist'", async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(undefined, decodedToken.id);

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => {
          const urlObj = new URL(u);
          return Boolean(urlObj.searchParams.get("m")?.includes("Invite does not exist"));
        })), Times.once());
      });
    });

    suite("Invite has already been accepted", () => {
      setup(() => {
        token = "hello-token";

        decodedToken = {
          id: "1330"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 1330;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Accepted";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test("Response is redirected to error page", async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.redirect(It.is(redirectUrl => redirectUrl.includes("/error"))), Times.once());
      });

      test("Redirect error message 'm' url parameter list contains 'Invite does not exist'", async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => {
          const urlObj = new URL(u);
          return Boolean(urlObj.searchParams.get("m")?.includes("Invite already accepted"));
        })), Times.once());
      });
    });

    suite("JWT is invalid (ApiError thrown by inviteService > jwtService)", () => {
      const tokenApiErrorMessage = "JWT expired or invalid";
      setup(() => {
        token = "hello-token";
      });

      test("Response is redirected to error page", async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_throws_ApiError(tokenApiErrorMessage);

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.redirect(It.is(redirectUrl => redirectUrl.includes("/error"))), Times.once());
      });

      test(`Redirect error message 'm' url parameter list contains ApiError ${tokenApiErrorMessage}`, async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_throws_ApiError(tokenApiErrorMessage);

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => {
          const urlObj = new URL(u);
          return Boolean(urlObj.searchParams.get("m")?.includes(tokenApiErrorMessage));
        })), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by inviteService", () => {
      setup(() => {
        token = "hello-token";
      });

      test(`Response returns generic ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} 'Error' in response errors array`, async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_throws_Error();

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test(`Response returns statusCode 500`, async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_throws_Error();

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectInviteRepository", () => {
      setup(() => {
        token = "hello-token";

        decodedToken = {
          id: "1330"
        };
      });

      test(`Response returns generic ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} 'Error' in response errors array`, async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_throws();

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test(`Response returns statusCode 500`, async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_throws();

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by userRepository", () => {
      setup(() => {
        token = "hello-token";

        decodedToken = {
          id: "1330"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 1330;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test(`Response returns generic ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} 'Error' in response errors array`, async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_userRepository_accountDoesExist_throws();

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test(`Response returns statusCode 500`, async () => {
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_userRepository_accountDoesExist_throws();

        await subject.inviteResponse(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("setupAndAccept", () => {
    let setupAccountBody: ISetupAccountRequest;
    let decodedToken: IProjectInviteToken;
    let projectInviteDbo: ProjectInviteDbo;
    let userTypeDbo: UserTypeDbo;
    let userDbo: UserDbo;

    suite("Valid request conditions", () => {
      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";

        userTypeDbo = new UserTypeDbo();
        userTypeDbo.id = 4;
        userTypeDbo.type = projectInviteDbo.userType;

        userDbo = new UserDbo();
        userDbo.id = "30";
        userDbo.firstName = setupAccountBody.firstName;
        userDbo.lastName = setupAccountBody.lastName;
        userDbo.email = projectInviteDbo.userEmail;
        userDbo.passwordHash = "aaaaaabbc!";
        userDbo.userType = userTypeDbo;
      });

      test("Request returns statusCode 200", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_returns_whenGiven(userDbo, It.isAny());

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });

      test("User data is given to userRepository addUser method", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_returns_whenGiven(userDbo, It.isAny());

        await subject.setupAndAccept(req.object, res.object);

        userRepository.verify(u => u.addUser({
          userType: userTypeDbo,
          firstName: setupAccountBody.firstName,
          lastName: setupAccountBody.lastName,
          email: projectInviteDbo.userEmail,
          passwordHash: "aaaaaabbc!"
        }), Times.once());
      });

      test("User is added to project", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_returns_whenGiven(userDbo, It.isAny());

        await subject.setupAndAccept(req.object, res.object);

        projectRepository.verify(p =>
          p.addUserToProject(projectInviteDbo.userEmail, projectInviteDbo.projectId.toString()), Times.once());
      });

      test("Invite is marked as accepted", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_returns_whenGiven(userDbo, It.isAny());

        await subject.setupAndAccept(req.object, res.object);

        projectInviteRepository.verify(p => p.inviteAccepted(projectInviteDbo), Times.once());
      });

      test("Request is logged in using credentials", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_returns_whenGiven(userDbo, It.isAny());

        await subject.setupAndAccept(req.object, res.object);

        req.verify(r => r.logIn({
          email: projectInviteDbo.userEmail,
          type: projectInviteDbo.userType
        }, It.isAny()), Times.once());
      });
    });

    suite("Invite is not found by projectInviteRepository", () => {
      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };

        decodedToken = {
          id: "10"
        };
      });

      test("Response is redirected to error page", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(undefined, decodedToken.id);

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.redirect(It.is(url => url.includes("/error"))), Times.once());
      });

      test("Redirect error message 'm' url parameter list contains 'Invite does not exist'", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(undefined, decodedToken);

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => {
          const urlObj = new URL(u);
          return Boolean(urlObj.searchParams.get("m")?.includes("Invite does not exist"));
        })), Times.once());
      });
    });

    suite("User type is not found by userTypeRepository", () => {
      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test("Response is redirected to error page", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_userTypeRepository_getTypeByType_returns_whenGiven(undefined, projectInviteDbo.userType);

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.redirect(It.is(url => url.includes("/error"))), Times.once());
      });

      test("Redirect error message 'm' url parameter list contains 'Invalid user type'", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_userTypeRepository_getTypeByType_returns_whenGiven(undefined, projectInviteDbo.userType);

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => {
          const urlObj = new URL(u);
          return Boolean(urlObj.searchParams.get("m")?.includes("Invalid user type"));
        })), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by inviteService decodeInviteToken", () => {
      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_throws_Error();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_throws_Error();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectInviteRepository getInviteById", () => {
      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by bcrypt hash", () => {

      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_hash_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_hash_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by userTypeRepository getTypeByType", () => {

      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";

        userTypeDbo = new UserTypeDbo();
        userTypeDbo.id = 4;
        userTypeDbo.type = projectInviteDbo.userType;
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by userRepository addUser", () => {
      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";

        userTypeDbo = new UserTypeDbo();
        userTypeDbo.id = 4;
        userTypeDbo.type = projectInviteDbo.userType;

        userDbo = new UserDbo();
        userDbo.id = "30";
        userDbo.firstName = setupAccountBody.firstName;
        userDbo.lastName = setupAccountBody.lastName;
        userDbo.email = projectInviteDbo.userEmail;
        userDbo.passwordHash = "aaaaaabbc!";
        userDbo.userType = userTypeDbo;
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectRepository addUserToProject", () => {

      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";

        userTypeDbo = new UserTypeDbo();
        userTypeDbo.id = 4;
        userTypeDbo.type = projectInviteDbo.userType;

        userDbo = new UserDbo();
        userDbo.id = "30";
        userDbo.firstName = setupAccountBody.firstName;
        userDbo.lastName = setupAccountBody.lastName;
        userDbo.email = projectInviteDbo.userEmail;
        userDbo.passwordHash = "aaaaaabbc!";
        userDbo.userType = userTypeDbo;
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_returns_whenGiven(userDbo, It.isAny());
        given_projectRepository_addUserToProject_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_returns_whenGiven(userDbo, It.isAny());
        given_projectRepository_addUserToProject_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectInviteRepository inviteAccepted", () => {

      setup(() => {
        setupAccountBody = {
          firstName: "Jon",
          lastName: "Reed",
          password: "password123",
          token: "hello-token"
        };

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";

        userTypeDbo = new UserTypeDbo();
        userTypeDbo.id = 4;
        userTypeDbo.type = projectInviteDbo.userType;

        userDbo = new UserDbo();
        userDbo.id = "30";
        userDbo.firstName = setupAccountBody.firstName;
        userDbo.lastName = setupAccountBody.lastName;
        userDbo.email = projectInviteDbo.userEmail;
        userDbo.passwordHash = "aaaaaabbc!";
        userDbo.userType = userTypeDbo;
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_returns_whenGiven(userDbo, It.isAny());
        given_projectInviteRepository_inviteAccepted_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_body_is(setupAccountBody);
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, setupAccountBody.token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_bcrypt_returns_whenGiven("aaaaaabbc!", setupAccountBody.password);
        given_userTypeRepository_getTypeByType_returns_whenGiven(userTypeDbo, projectInviteDbo.userType);
        given_userRepository_addUser_returns_whenGiven(userDbo, It.isAny());
        given_projectInviteRepository_inviteAccepted_throws();

        await subject.setupAndAccept(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });

    });

  });

  suite("acceptInvite", () => {
    let urlSegs: string[] = [];
    let token: string;
    let decodedToken: IProjectInviteToken;
    let projectInviteDbo: ProjectInviteDbo;

    suite("Valid request conditions (user not logged in)", () => {
      setup(() => {
        urlSegs = [
          "http",
          "www.test.com",
          "/accept"
        ];

        token = "hello-token";

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test("User is redirected to login page", async () => {
        given_Request_sent_from_url(urlSegs[0], urlSegs[1], urlSegs[2]);

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => u.includes("/login"))), Times.once());
      });

      test("Original route is in the redirect 'r' url parameter", async () => {
        given_Request_sent_from_url(urlSegs[0], urlSegs[1], urlSegs[2]);

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => {
          const urlObj = new URL(u);
          return Boolean(urlObj.searchParams.get("r") === `${urlSegs[0]}://${urlSegs[1]}${urlSegs[2]}`);
        })), Times.once());
      });
    });

    suite("Valid request conditions (user is logged in)", () => {
      setup(() => {
        urlSegs = [
          "http",
          "www.test.com",
          "/accept"
        ];

        token = "hello-token";

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test("User is added to project", async () => {
        given_Request_user_is({ email: projectInviteDbo.userEmail, type: projectInviteDbo.userType });
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);

        await subject.acceptInvite(req.object, res.object);

        projectRepository.verify(p => p.addUserToProject(projectInviteDbo.userEmail, projectInviteDbo.projectId.toString()), Times.once());
      });

      test("Invite is marked as accepted", async () => {
        given_Request_user_is({ email: projectInviteDbo.userEmail, type: projectInviteDbo.userType });
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);

        await subject.acceptInvite(req.object, res.object);

        projectInviteRepository.verify(p => p.inviteAccepted(projectInviteDbo), Times.once());
      });

      test("Response is redirected to the project", async () => {
        given_Request_user_is({ email: projectInviteDbo.userEmail, type: projectInviteDbo.userType });
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => u.includes("/project/" + projectInviteDbo.projectId))), Times.once());
      });
    });

    suite("Invite not found by projectInviteRepository", () => {

      setup(() => {

        token = "hello-token";

        decodedToken = {
          id: "10"
        };
      });

      test("Response is redirected to error page", async () => {
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(undefined, decodedToken.id);

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => u.includes("/error"))), Times.once());
      });

      test("Redirect error message 'm' url parameter list contains 'Invite does not exist'", async () => {
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(undefined, decodedToken.id);

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.redirect(It.is(u => {
          const urlObj = new URL(u);
          return Boolean(urlObj.searchParams.get("m")?.includes("Invite does not exist"));
        })), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by inviteService decodeInviteToken", () => {

      setup(() => {
        urlSegs = [
          "http",
          "www.test.com",
          "/accept"
        ];

        token = "hello-token";
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_throws_Error();

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_throws_Error();

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectInviteRepository getInviteById", () => {

      setup(() => {
        urlSegs = [
          "http",
          "www.test.com",
          "/accept"
        ];

        token = "hello-token";

        decodedToken = {
          id: "10"
        };
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_throws();

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_throws();

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectRepository addUserToProject", () => {

      setup(() => {
        urlSegs = [
          "http",
          "www.test.com",
          "/accept"
        ];

        token = "hello-token";

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_user_is({ email: projectInviteDbo.userEmail, type: projectInviteDbo.userType });
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_projectRepository_addUserToProject_throws();

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_user_is({ email: projectInviteDbo.userEmail, type: projectInviteDbo.userType });
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_projectRepository_addUserToProject_throws();

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectInviteRepository inviteAccepted", () => {

      setup(() => {
        urlSegs = [
          "http",
          "www.test.com",
          "/accept"
        ];

        token = "hello-token";

        decodedToken = {
          id: "10"
        };

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 10;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test(`Response returns ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in response errors array`, async () => {
        given_Request_user_is({ email: projectInviteDbo.userEmail, type: projectInviteDbo.userType });
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_projectInviteRepository_inviteAccepted_throws();

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_user_is({ email: projectInviteDbo.userEmail, type: projectInviteDbo.userType });
        given_Request_user_isAuthenticated_returns(true);
        given_Request_params_are({ token });
        given_inviteService_decodeInviteToken_returns_whenGiven(decodedToken, token);
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, decodedToken.id);
        given_projectInviteRepository_inviteAccepted_throws();

        await subject.acceptInvite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  suite("resendInvite", () => {
    let inviteId: string;
    let projectInviteDbo: ProjectInviteDbo;

    suite("Valid request conditions", () => {
      setup(() => {
        inviteId = "10";

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 1330;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test("Response should return statusCode 200", async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, inviteId);
        given_inviteService_inviteClient_does_not_throw();

        await subject.resendInvite(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });

      test("InviteService inviteClient is called to send email to client", async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, inviteId);
        given_inviteService_inviteClient_does_not_throw();

        await subject.resendInvite(req.object, res.object);

        inviteService.verify(i => i.inviteClient(projectInviteDbo.userEmail, projectInviteDbo.id.toString()), Times.once());
      });
    });

    suite("Invite is not found by projectInviteRepository", () => {

      setup(() => {
        inviteId = "10";
      });

      test("Response returns 'Invite does not exist' in errors array", async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_returns_whenGiven(undefined, inviteId);
        given_inviteService_inviteClient_does_not_throw();

        await subject.resendInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes("Invite does not exist"))), Times.once());
      });

      test("Response returns statusCode 400", async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_returns_whenGiven(undefined, inviteId);
        given_inviteService_inviteClient_does_not_throw();

        await subject.resendInvite(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });

    suite("Invite has already been accepted", () => {

      setup(() => {
        inviteId = "10";

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 1330;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Accepted";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test("Response returns 'Invite has already been accepted' in errors array", async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, inviteId);
        given_inviteService_inviteClient_does_not_throw();

        await subject.resendInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes("Invite has already been accepted"))), Times.once());
      });

      test("Response returns statusCode 400", async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, inviteId);
        given_inviteService_inviteClient_does_not_throw();

        await subject.resendInvite(req.object, res.object);

        res.verify(r => r.status(BAD_REQUEST), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by projectInviteRepository getInviteById", () => {

      setup(() => {
        inviteId = "10";
      });

      test(`Response errors contains generic '${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}' error message`, async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_throws();

        await subject.resendInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_throws();

        await subject.resendInvite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected 'Error' thrown by inviteService inviteClient", () => {

      setup(() => {
        inviteId = "10";

        projectInviteDbo = new ProjectInviteDbo();
        projectInviteDbo.id = 1330;
        projectInviteDbo.projectId = 3021;
        projectInviteDbo.status = "Pending";
        projectInviteDbo.userType = "Client";
        projectInviteDbo.userEmail = "user1@me.com";
      });

      test(`Response errors contains generic '${BaseController.INTERNAL_SERVER_ERROR_MESSAGE}' error message`, async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, inviteId);
        given_inviteService_inviteClient_throws();

        await subject.resendInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_params_are({ id: inviteId });
        given_projectInviteRepository_getInviteById_returns_whenGiven(projectInviteDbo, inviteId);
        given_inviteService_inviteClient_throws();

        await subject.resendInvite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

  });

  suite("deleteInvite", () => {
    let params: any;
    let inviteDbo: ProjectInviteDbo;

    suite("Valid request conditions", () => {

      setup(() => {
        params = {
          id: "4"
        };

        inviteDbo = new ProjectInviteDbo();
        inviteDbo.status = "Pending";
      });

      test("Request payload is undefined", async () => {
        given_Request_params_are(params);
        given_projectInviteRepository_getInviteById_returns_whenGiven(inviteDbo, params.id);

        await subject.deleteInvite(req.object, res.object);

        res.verify(r => r.status(OK), Times.once());
      });
    });

    suite("User is trying to revoke an invitation which has already been accepted", () => {

      setup(() => {
        params = {
          id: "9"
        };

        inviteDbo = new ProjectInviteDbo();
        inviteDbo.status = "Accepted";
      });
      test(
        "Response returns 'This invite has alredy been accepted by the client user. They will still be able to access this project until you remove them.' in errors array"
        , async () => {
          given_Request_params_are(params);
          given_projectInviteRepository_getInviteById_returns_whenGiven(inviteDbo, params.id);

          await subject.deleteInvite(req.object, res.object);

          res.verify(r => r.json(It.is(body =>
            body.errors.includes(
              "This invite has alredy been accepted by the client user. They will still be able to access this project until you remove them."
            ))), Times.once());
        });

      test("Response returns statusCode 410", async () => {
        given_Request_params_are(params);
        given_projectInviteRepository_getInviteById_returns_whenGiven(inviteDbo, params.id);

        await subject.deleteInvite(req.object, res.object);

        res.verify(r => r.status(GONE), Times.once());
      });
    });

    suite("Unexpected error thrown by projectInviteRepository getInviteById", () => {

      setup(() => {
        setup(() => {
          params = {
            id: "4"
          };
        });
      });

      test(`Response returns generic ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in errors array`, async () => {
        given_Request_params_are(params);
        given_projectInviteRepository_getInviteById_throws();

        await subject.deleteInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test("Response returns statusCode 500", async () => {
        given_Request_params_are(params);
        given_projectInviteRepository_getInviteById_throws();

        await subject.deleteInvite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });

    suite("Unexpected error thrown by projectInviteRepository deleteInvite", () => {
      test(`Request returns generic ${BaseController.INTERNAL_SERVER_ERROR_MESSAGE} in errors array`, async () => {
        given_Request_params_are({ id: "4" });
        given_projectRepository_deleteInvite_throws();

        await subject.deleteInvite(req.object, res.object);

        res.verify(r => r.json(It.is(body => body.errors.includes(BaseController.INTERNAL_SERVER_ERROR_MESSAGE))), Times.once());
      });

      test(`Request statusCode 500`, async () => {
        given_Request_params_are({ id: "4" });
        given_projectRepository_deleteInvite_throws();

        await subject.deleteInvite(req.object, res.object);

        res.verify(r => r.status(INTERNAL_SERVER_ERROR), Times.once());
      });
    });
  });

  function given_Request_body_is(body: any): void {
    req
      .setup(r => r.body)
      .returns(() => body);
  }

  function given_Request_params_are(params: any): void {
    req
      .setup(r => r.params)
      .returns(() => params);
  }

  function given_Request_sent_from_url(protocol: string, host: string, path: string) {
    req
      .setup(r => r.protocol)
      .returns(() => protocol);

    req
      .setup(r => r.get("host"))
      .returns(() => host);

    req
      .setup(r => r.originalUrl)
      .returns(() => path);
  }

  function given_Request_user_is(user: IUserToken) {
    req
      .setup(r => r.user)
      .returns(() => user);
  }

  function given_Request_user_isAuthenticated_returns(returns: boolean) {
    req
      .setup(r => r.isAuthenticated())
      .returns(() => returns);
  }

  function given_projectInviteRepository_createInvite_returns_new_invite(): void {
    projectInviteRepository
      .setup(p => p.createInvite(It.isAny()))
      .returns(async () => {
        const invite = new ProjectInviteDbo();
        invite.id = Math.random();
        return invite;
      });
  }

  function given_projectInviteRepository_getOpenInvitesForProject_returns_whenGiven(returns: ProjectInviteDbo[], whenGiven: any) {
    projectInviteRepository
      .setup(p => p.getOpenInvitesForProject(whenGiven))
      .returns(async () => returns);
  }

  function given_inviteService_inviteClient_does_not_throw() {
    inviteService
      .setup(i => i.inviteClient(It.isAny(), It.isAny()))
      .returns(async () => { return; });
  }

  function given_inviteService_decodeInviteToken_returns_whenGiven(returns: any, whenGiven: any) {
    inviteService
      .setup(i => i.decodeInviteToken(whenGiven))
      .returns(() => returns);
  }

  function given_projectInviteRepository_createInvite_throws() {
    projectInviteRepository
      .setup(p => p.createInvite(It.isAny()))
      .throws(new Error("Sensitive database info!"));
  }

  function given_projectInviteRepository_getInviteById_returns_whenGiven(returns: ProjectInviteDbo | undefined, whenGiven: any) {
    projectInviteRepository
      .setup(p => p.getInviteById(whenGiven))
      .returns(async () => returns);
  }

  function given_inviteService_inviteClient_throws() {
    inviteService
      .setup(i => i.inviteClient(It.isAny(), It.isAny()))
      .throws(new Error("Sensitive database info!"));
  }

  function given_userRepository_accountDoesExist_returns(returns: boolean) {
    userRepository
      .setup(u => u.accountDoesExist(It.isAny()))
      .returns(async () => returns);
  }

  function given_inviteService_decodeInviteToken_throws_ApiError(message: string) {
    inviteService
      .setup(i => i.decodeInviteToken(It.isAny()))
      .throws(new ApiError(message, BAD_REQUEST, true));
  }

  function given_bcrypt_returns_whenGiven(returns: string, whenGiven: string) {
    bcrypt
      .setup(b => b.hash(whenGiven))
      .returns(() => returns);
  }

  function given_userTypeRepository_getTypeByType_returns_whenGiven(returns: UserTypeDbo | undefined, whenGiven: string) {
    userTypeRepository
      .setup(u => u.getTypeByType(whenGiven))
      .returns(async () => returns);
  }

  function given_userRepository_addUser_returns_whenGiven(returns: UserDbo, whenGiven: any) {
    userRepository
      .setup(u => u.addUser(whenGiven))
      .returns(async () => returns);
  }

  function given_projectRepository_deleteInvite_throws() {
    projectInviteRepository
      .setup(p => p.deleteInvite(It.isAny()))
      .throws(new Error("Database info!"));
  }

  function given_projectRepository_getUsersForProject_returns_whenGiven(returns: UserProjectRoleDbo[], whenGiven: any) {
    projectRepository
      .setup(p => p.getUsersForProject(whenGiven))
      .returns(async () => returns);
  }

  function given_inviteService_decodeInviteToken_throws_Error() {
    inviteService
      .setup(i => i.decodeInviteToken(It.isAny()))
      .throws(new Error("InviteService info!"));
  }

  function given_projectInviteRepository_getInviteById_throws() {
    projectInviteRepository
      .setup(p => p.getInviteById(It.isAny()))
      .throws(new Error("Database info!"));
  }

  function given_userRepository_accountDoesExist_throws() {
    userRepository
      .setup(u => u.accountDoesExist(It.isAny()))
      .throws(new Error("Database information"));
  }

  function given_bcrypt_hash_throws() {
    bcrypt
      .setup(b => b.hash(It.isAny()))
      .throws(new Error("bcrypt service information!"));
  }

  function given_userTypeRepository_getTypeByType_throws() {
    userTypeRepository
      .setup(u => u.getTypeByType(It.isAny()))
      .throws(new Error("database information!"));
  }

  function given_userRepository_addUser_throws() {
    userRepository
      .setup(u => u.addUser(It.isAny()))
      .throws(new Error("User repository data!"));
  }

  function given_projectRepository_addUserToProject_throws() {
    projectRepository
      .setup(p => p.addUserToProject(It.isAny(), It.isAny()))
      .throws(new Error("Database Info!"));
  }

  function given_projectInviteRepository_inviteAccepted_throws() {
    projectInviteRepository
      .setup(p => p.inviteAccepted(It.isAny()))
      .throws(new Error("Database info!"));
  }
});
