import { Mock, Times, It, IMock } from "typemoq";
import { StepFeedbackApiService } from "./step-feedback-api.service";
import { ApiService } from "../api.service";
import { expectNothing } from "test-utils/expect-nothing";

describe("StepFeedbackApiService", () => {
  let apiService: IMock<ApiService>;

  let subject: StepFeedbackApiService;

  beforeEach(() => {
    apiService = Mock.ofType<ApiService>();

    subject = new StepFeedbackApiService(apiService.object);
  });

  describe("getLatestStepFeedbackFromUser", () => {
    it("calls ApiService patch with the correct endpoint", async () => {
      const stepId: string = "3";
      const userEmail: string = "user@domain.tld";
      const endpoint = `/feedback?stepId=${stepId}&userEmail=${userEmail}&onlyLatest=true`;

      await subject.getLatestStepFeedbackFromUser(stepId, userEmail);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("getAllFeedbackForProject", () => {
    it("calls ApiService patch with the correct endpoint", async () => {
      const projectId: string = "3";
      const endpoint: string = `/feedback/project?projectId=${projectId}`;

      await subject.getAllFeedbackForProject(projectId);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("addFeedbackForStep", () => {
    it("calls ApiService patch with the correct endpoint", async () => {
      const stepId: string = "3";
      const notes: string = "Great!";
      const status: string = "Passed";
      const endpoint: string = "/feedback";

      await subject.addFeedbackForStep(stepId, notes, status);

      apiService.verify(a => a.post(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService patch with the correct endpoint", async () => {
      const stepId: string = "3";
      const notes: string = "Great!";
      const status: string = "Passed";
      const payload = { stepId, notes, status };

      await subject.addFeedbackForStep(stepId, notes, status);

      apiService.verify(a => a.post(It.isAny(), payload), Times.once());
      expectNothing();
    });
  });
});
