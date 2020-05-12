import { Mock, Times, It, IMock } from "typemoq";
import { StepApiService } from "./step-api.service";
import { ApiService } from "../api.service";
import { expectNothing } from "test-utils/expect-nothing";
import { IStepResponse } from "src/app/models/api/response/supplier/step.interface";

describe("StepApiService", () => {
  let apiService: IMock<ApiService>;

  let subject: StepApiService;

  beforeEach(() => {
    apiService = Mock.ofType<ApiService>();

    subject = new StepApiService(apiService.object);
  });

  describe("addStepToCase", () => {
    it("calls ApiService post with the correct endpoint", async () => {
      const endpoint = "/steps";
      const caseId: string = "3";
      const description: string = "I am a new step";

      await subject.addStepToCase(description, caseId);

      apiService.verify(a => a.post(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService post with the provided data", async () => {
      const endpoint = "/steps";
      const caseId: string = "3";
      const description: string = "I am a new step";
      const payload = { caseId, description };

      await subject.addStepToCase(description, caseId);

      apiService.verify(a => a.post( It.isAny(), payload), Times.once());
      expectNothing();
    });
  });

  describe("getStepsforCase", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const caseId: string = "3";
      const endpoint = `/steps?caseId=${caseId}`;

      await subject.getStepsforCase(caseId);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("updateStep", () => {
    it("calls ApiService patch with the correct endpoint", async () => {
      const stepData: IStepResponse = {
        id: "4",
        description: "New Description"
      };
      const endpoint = `/steps/${stepData.id}`;

      await subject.updateStep(stepData);

      apiService.verify(a => a.patch(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService patch with the provided step data", async () => {
      const stepData: IStepResponse = {
        id: "4",
        description: "New Description"
      };

      await subject.updateStep(stepData);

      apiService.verify(a => a.patch(It.isAny(), stepData), Times.once());
      expectNothing();
    });
  });

  describe("deleteStepById", () => {
    it("calls ApiService patch with the correct endpoint", async () => {
      const stepId: string = "3";
      const endpoint: string = `/steps/${stepId}`;

      await subject.deleteStepById(stepId);

      apiService.verify(a => a.delete(endpoint), Times.once());
      expectNothing();
    });
  });
});
