import { Mock, Times, It, IMock } from "typemoq";
import { InviteApiService } from "./invite-api.service";
import { SessionService } from "../../session/session.service";
import { ApiService } from "../api.service";
import { ISetupAccountRequest } from "src/app/models/api/request/common/setup-account";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";
import { expectNothing } from "test-utils/expect-nothing";

describe("InviteApiService", () => {
  let apiService: IMock<ApiService>;
  let sessionService: IMock<SessionService>;

  let subject: InviteApiService;

  beforeEach(() => {
    apiService = Mock.ofType<ApiService>();
    sessionService = Mock.ofType<SessionService>();

    subject = new InviteApiService(apiService.object, sessionService.object);
  });

  describe("setupAccount", () => {
    it("calls ApiService post with the correct endpoint", async () => {
      const endpoint = "/invite/setup";
      const userData: ISetupAccountRequest = {
        firstName: "John",
        lastName: "Smith",
        password: "Passw0rd",
        token: "asdf"
      };
      const response: IApiResponse<any> = { payload: {}, statusCode: 0, errors: [] }
      given_ApiService_post_returns(response);

      await subject.setupAccount(userData);

      apiService.verify(a => a.post(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService post with the user setup data", async () => {
      const userData: ISetupAccountRequest = {
        firstName: "John",
        lastName: "Smith",
        password: "Passw0rd",
        token: "asdf"
      };
      const response: IApiResponse<any> = { payload: {}, statusCode: 0, errors: [] }
      given_ApiService_post_returns(response);

      await subject.setupAccount(userData);

      apiService.verify(a => a.post(It.isAny(), userData), Times.once());
      expectNothing();
    });

    it("calls SessionService setUser", async () => {
      const userData: ISetupAccountRequest = {
        firstName: "John",
        lastName: "Smith",
        password: "Passw0rd",
        token: "asdf"
      };
      const response: IApiResponse<any> = { payload: {}, statusCode: 0, errors: [] }
      given_ApiService_post_returns(response);

      await subject.setupAccount(userData);

      sessionService.verify(s => s.setUser(), Times.once());
      expectNothing();
    });
  });

  describe("inviteClients", () => {
    it("calls ApiService post with the correct endpoint", async () => {
      const endpoint = "/invite/client";
      const emails = [];
      const projectId = "100";

      await subject.inviteClients(emails, projectId);

      apiService.verify(a => a.post(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService post with the provided email and projectId", async () => {
      const endpoint = "/invite/client";
      const emails = [];
      const projectId = "100";
      const payload = { emails, projectId };

      await subject.inviteClients(emails, projectId);

      apiService.verify(a => a.post(endpoint, payload), Times.once());
      expectNothing();
    });
  });

  describe("revokeInvite", () => {
    it("calls ApiService delete with the correct endpoint", async () => {
      const inviteId = "300";
      const endpoint = `/invite/${inviteId}`;

      await subject.revokeInvite(inviteId);

      apiService.verify(a => a.delete(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("resendInvite", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const inviteId = "300";
      const endpoint = `/invite/resend/${inviteId}`;

      await subject.resendInvite(inviteId);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  function given_ApiService_post_returns(returns: IApiResponse<any>) {
    apiService
      .setup(a => a.post(It.isAny(), It.isAny()))
      .returns(async () => returns);
  }
});
