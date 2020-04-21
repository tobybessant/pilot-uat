import { Mock, Times, It, IMock } from "typemoq";
import { TestSuiteApiService } from "./test-suite-api.service";
import { ApiService } from "../api.service";
import { ICreateSuiteRequest } from "src/app/models/api/request/supplier/create-suite.interface";
import { expectNothing } from "test-utils/expect-nothing";

describe("SuiteApiService", () => {
  let apiService: IMock<ApiService>;

  let subject: TestSuiteApiService;

  beforeEach(() => {
    apiService = Mock.ofType<ApiService>();

    subject = new TestSuiteApiService(apiService.object);
  });

  describe("addTestSuite", () => {
    it("calls ApiService post with the correct endpoint", async () => {
      const suiteData: ICreateSuiteRequest = {
        projectId: "5",
        title: "New Suite!"
      };
      const endpoint: string = "/suites";

      await subject.addTestSuite(suiteData);

      apiService.verify(a => a.post(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService post with the provided data", async () => {
      const suiteData: ICreateSuiteRequest = {
        projectId: "5",
        title: "New Suite!"
      };
      const endpoint: string = "/suites";

      await subject.addTestSuite(suiteData);

      apiService.verify(a => a.post(It.isAny(), suiteData), Times.once());
      expectNothing();
    });
  });

  describe("getTestSuitesForProject", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const projectId: string = "3";
      const endpoint: string = `/suites?projectId=${projectId}`;

      await subject.getTestSuitesForProject(projectId);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("deleteTestSuiteById", () => {
    it("calls ApiService delete with the correct endpoint", async () => {
      const suiteId: string = "31";
      const endpoint: string = `/suites/${suiteId}`;

      await subject.deleteTestSuiteById(suiteId);

      apiService.verify(a => a.delete(endpoint), Times.once());
      expectNothing();
    });
  });
});
