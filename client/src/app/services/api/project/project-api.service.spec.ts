import { Mock, Times, It, IMock } from "typemoq";
import { ProjectApiService } from "./project-api.service";
import { ApiService } from "../api.service";
import { ICreateProjectRequest } from "src/app/models/api/request/supplier/create-project.interface";
import { expectNothing } from "test-utils/expect-nothing";

describe("ProjectApiService", () => {
  let apiService: IMock<ApiService>;

  let subject: ProjectApiService;

  beforeEach(() => {
    apiService = Mock.ofType<ApiService>();
    subject = new ProjectApiService(apiService.object);
  });

  describe("getProjects", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const endpoint = "/projects";

      await subject.getProjects();

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("getProjectById (non-extensive)", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const projectId = "10";
      const extensive = false;
      const endpoint = `/projects/${projectId}?extensive=${extensive}`;

      await subject.getProjectById(projectId, extensive);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("getProjectById (extensive)", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const projectId = "10";
      const extensive = true;
      const endpoint = `/projects/${projectId}?extensive=${extensive}`;

      await subject.getProjectById(projectId, extensive);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("addProject", () => {
    it("calls ApiService post with the correct endpoint", async () => {
      const endpoint = `/projects`;
      const project: ICreateProjectRequest = {
        title: "New Project"
      };

      await subject.addProject(project);

      apiService.verify(a => a.post(endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls ApiService post with the provided project data", async () => {
      const project: ICreateProjectRequest = {
        title: "New Project"
      };

      await subject.addProject(project);

      apiService.verify(a => a.post(It.isAny(), project), Times.once());
      expectNothing();
    });
  });

  describe("deleteProject", () => {
    it("calls ApiService delete with the correct endpoint", async () => {
      const projectId: string = "4";
      const endpoint: string = `/projects/${projectId}`;

      await subject.deleteProject(projectId);

      apiService.verify(a => a.delete(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("getUsersForProject", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const projectId: string = "4";
      const endpoint: string = `/projects/${projectId}/users`;

      await subject.getUsersForProject(projectId);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("getOpenInvitesForProject", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const projectId: string = "4";
      const endpoint: string = `/projects/${projectId}/invites`;

      await subject.getOpenInvitesForProject(projectId);

      apiService.verify(a => a.get(endpoint), Times.once());
      expectNothing();
    });
  });

  describe("removeUserFromProject", () => {
    it("calls ApiService get with the correct endpoint", async () => {
      const projectId: string = "4";
      const userId: string = "90";
      const endpoint: string = `/projects/${projectId}/${userId}`;

      await subject.removeUserFromProject(userId, projectId);

      apiService.verify(a => a.delete(endpoint), Times.once());
      expectNothing();
    });
  });
});
