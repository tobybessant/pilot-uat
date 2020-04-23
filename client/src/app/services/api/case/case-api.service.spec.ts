import { Mock, Times, It, IMock } from "typemoq";
import { CaseApiService } from "./case-api.service";
import { ApiService } from "../api.service";
import { ICreateCaseRequest } from "src/app/models/api/request/supplier/create-test.interface";
import { ICaseResponse } from "src/app/models/api/response/supplier/case.interface";
import { expectNothing } from "test-utils/expect-nothing";

describe("CaseApiService", () => {
  let apiService: IMock<ApiService>;

  let subject: CaseApiService;

  beforeEach(() => {
    apiService = Mock.ofType<ApiService>();

    subject = new CaseApiService(apiService.object);
  });

  describe("addCase", () => {
    it("calls ApiService post with the correct endpoint", async () => {
      const endpoint = "/cases";
      const caseData: ICreateCaseRequest = {
        suiteId: "4",
        title: "New Case"
      };

      await subject.addCase(caseData);

      apiService.verify(a => a.post(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService post with the provided case data", async () => {
      const caseData: ICreateCaseRequest = {
        suiteId: "4",
        title: "New Case"
      };

      await subject.addCase(caseData);

      apiService.verify(a => a.post(It.isAny(), caseData), Times.once());
      expectNothing();
    });
  });

  describe("updateCase", () => {
    it("calls ApiService patch with the correct endpoint", async () => {
      const caseData: ICaseResponse = {
        id: "4",
        steps: [],
        title: "Case Title"
      };
      const endpoint = `/cases/${caseData.id}`;

      await subject.updateCase(caseData);

      apiService.verify(a => a.patch(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService patch with the case data", async () => {
      const endpoint = "/cases";
      const caseData: ICaseResponse = {
        id: "4",
        steps: [],
        title: "Case Title"
      };

      await subject.updateCase(caseData);

      apiService.verify(a => a.patch(It.isAny(), caseData), Times.once());
      expectNothing();
    });
  });

  describe("getCasesForSuite", () => {
    it("calls ApiService get with correct endpoint", async () => {
      const suiteId = "5";
      const endpoint = `/cases?suiteId=${suiteId}`;

      await subject.getCasesForSuite(suiteId);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("deleteCaseById", () => {
    it("calls ApiService get with correct endpoint", async () => {
      const caseId = "12";
      const endpoint = `/cases/${caseId}`;

      await subject.deleteCaseById(caseId);

      apiService.verify(a => a.delete(endpoint), Times.once());
      expectNothing();
    });
  });
});
