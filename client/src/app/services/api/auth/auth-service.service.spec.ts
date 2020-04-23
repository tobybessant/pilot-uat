import { IMock, Mock, Times, It } from "typemoq";
import { AuthService } from "./auth-service.service";
import { SessionService } from "../../session/session.service";
import { ApiService } from "../api.service";
import { ICreateAccountRequest } from "src/app/models/api/request/common/create-account.interface";
import { expectNothing } from "test-utils/expect-nothing";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";
import { ISignInRequest } from "src/app/models/api/request/common/sign-in.interface";

describe("AuthApiService", () => {
  let sessionService: IMock<SessionService>;
  let apiService: IMock<ApiService>;

  let subject: AuthService;

  beforeEach(() => {
    sessionService = Mock.ofType<SessionService>();
    apiService = Mock.ofType<ApiService>();

    subject = new AuthService(apiService.object, sessionService.object);
  });

  describe("createUser", () => {
    it("calls ApiService post with the correct endpoint", async () => {
      const endpoint = "/auth/createaccount";
      const user: ICreateAccountRequest = {
        email: "hello@me.com",
        firstName: "F",
        lastName: "L",
        organisationName: "Org",
        password: "CorrectHorseBatteryStaple",
        type: "Supplier"
      };
      const response = { errors: [], statusCode: 1, payload: {} };

      given_ApiService_post_returns(response);

      await subject.createUser(user);

      apiService.verify(a => a.post(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService post with the user payload data", async () => {
      const user: ICreateAccountRequest = {
        email: "hello@me.com",
        firstName: "F",
        lastName: "L",
        organisationName: "Org",
        password: "CorrectHorseBatteryStaple",
        type: "Supplier"
      };
      const response = { errors: [], statusCode: 1, payload: {} };

      given_ApiService_post_returns(response);

      await subject.createUser(user);

      apiService.verify(a => a.post(It.isAny(), user), Times.once());
      expectNothing();
    });

    it("calls SessionService setUser", async () => {
      const user: ICreateAccountRequest = {
        email: "hello@me.com",
        firstName: "F",
        lastName: "L",
        organisationName: "Org",
        password: "CorrectHorseBatteryStaple",
        type: "Supplier"
      };
      const response = { errors: [], statusCode: 1, payload: {} };

      given_ApiService_post_returns(response);

      await subject.createUser(user);

      sessionService.verify(s => s.setUser(), Times.once());
      expectNothing();
    });
  });

  describe("login", () => {
    it("calls ApiService post with the correct endpoint", async () => {
      const endpoint = "/auth/login";
      const credentials: ISignInRequest = {
        email: "hello@me.com",
        password: "p4ssword"
      };
      const response = { errors: [], statusCode: 1, payload: {} };

      given_ApiService_post_returns(response);

      await subject.login(credentials);

      apiService.verify(a => a.post(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService post with the provided credentials", async () => {
      const credentials: ISignInRequest = {
        email: "hello@me.com",
        password: "p4ssword"
      };
      const response = { errors: [], statusCode: 1, payload: {} };

      given_ApiService_post_returns(response);

      await subject.login(credentials);

      apiService.verify(a => a.post(It.isAny(), credentials), Times.once());
      expectNothing();
    });

    it("calls ApiService post with the provided credentials", async () => {
      const credentials: ISignInRequest = {
        email: "hello@me.com",
        password: "p4ssword"
      };
      const response = { errors: [], statusCode: 1, payload: {} };

      given_ApiService_post_returns(response);

      await subject.login(credentials);

      sessionService.verify(s => s.setUser(), Times.once());
      expectNothing();
    });
  });

  describe("logout", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const endpoint = "/auth/logout";

      await subject.logout();

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });

    it("calls sessionService logout", async () => {
      await subject.logout();

      sessionService.verify(s => s.logout(), Times.once());
      expectNothing();
    });
  });

  function given_ApiService_post_returns(returns: IApiResponse<any>) {
    apiService
      .setup(a => a.post(It.isAny(), It.isAny()))
      .returns(async () => returns);
  }
});
