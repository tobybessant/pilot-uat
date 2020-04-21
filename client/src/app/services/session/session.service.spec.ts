import { IMock, Mock, Times } from "typemoq";
import { SessionService } from "./session.service";
import { UserApiService } from "../api/user/user-api.service";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";
import { expectNothing } from "../../../../test-utils/expect-nothing";

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

      expect(subject.getCurrentUser()).toEqual(accountDetailsResponse.payload);
    });
  });

  function given_userService_getLoggedInAccountDetails_returns(returns: IApiResponse<any>) {
    userService
      .setup(u => u.getLoggedInAccountDetails())
      .returns(async () => returns);
  }
});
