import { Mock, Times, It, IMock } from "typemoq";
import { UserApiService } from "./user-api.service";
import { ApiService } from "../api.service";
import { expectNothing } from "test-utils/expect-nothing";

describe("UserService", () => {
  let apiService: IMock<ApiService>;

  let subject: UserApiService;

  beforeEach(() => {
    apiService = Mock.ofType<ApiService>();

    subject = new UserApiService(apiService.object);
  });

  describe("getLoggedInAccountDetails", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const endpoint: string = "/user/account";

      await subject.getLoggedInAccountDetails();

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });
});
