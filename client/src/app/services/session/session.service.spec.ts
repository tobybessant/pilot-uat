import { IMock, Mock, Times } from "typemoq";
import { SessionService } from "./session.service";
import { UserApiService } from "../api/user/user-api.service";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";
import { expectNothing } from "../../../../test-utils/expect-nothing";
import { Observable } from "rxjs";

describe("SessionService", () => {
  let subject: SessionService;

  let userService: IMock<UserApiService>;

  beforeEach(() => {
    userService = Mock.ofType<UserApiService>();

    subject = new SessionService(userService.object);
  });

  describe("setUser", () => {
    let accountDetailsResponse: IApiResponse<any>;

    beforeEach(() => {
      accountDetailsResponse = {
        statusCode: 0,
        errors: [],
        payload: {
          email: "email@me.com"
        }
      };
    });

    it("calls getLoggedInAccountDetails once", async () => {
      given_userService_getLoggedInAccountDetails_returns(accountDetailsResponse);

      await subject.setUser();

      userService.verify(u => u.getLoggedInAccountDetails(), Times.once());
      expectNothing();
    });

    it("Sets the sessionService currentUser", async () => {
      given_userService_getLoggedInAccountDetails_returns(accountDetailsResponse);

      await subject.setUser();

      // tslint:disable-next-line: no-string-literal
      expect(subject["currentUser"]).toEqual(accountDetailsResponse.payload);
    });
  });

  describe("getSubject", () => {
    it("returns a type of Observable", async () => {
      const user = subject.getSubject();

      expect(user).toBeInstanceOf(Observable);
    });
  });

  describe("logout", () => {
    it("sets the current user to null", async () => {
      const user = subject.logout();

      // tslint:disable-next-line: no-string-literal
      expect(subject["currentUser"]).toBeNull();
    });
  });

  function given_userService_getLoggedInAccountDetails_returns(returns: IApiResponse<any>) {
    userService
      .setup(u => u.getLoggedInAccountDetails())
      .returns(async () => returns);
  }
});
