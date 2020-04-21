import { IMock, Mock, Times, It } from "typemoq";

import { ApiService } from "./api.service";
import { NbToastrService } from "@nebular/theme";
import { HttpClient } from "@angular/common/http";
import { expectNothing } from "test-utils/expect-nothing";

describe("ApiService", () => {
  let httpClient: IMock<HttpClient>;
  let toastService: IMock<NbToastrService>;

  let subject: ApiService;

  beforeEach(() => {
    httpClient = Mock.ofType<HttpClient>();
    toastService = Mock.ofType<NbToastrService>();

    subject = new ApiService(httpClient.object, toastService.object);
  });

  describe("get", () => {
    it("calls httpClient get with the root + parameter endpoint", async () => {
      const endpoint = "/endpoint";
      await subject.get(endpoint);

      httpClient.verify(h => h.get(ApiService.root + endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls httpClient get with the 'withCredenials' flag set to true", async () => {
      const endpoint = "/endpoint";
      await subject.get(endpoint);

      httpClient.verify(h => h.get(It.isAny(), { withCredentials: true }), Times.once());
      expectNothing();
    });
  });

  describe("post", () => {
    it("calls httpClient post with the root + parameter endpoint", async () => {
      const endpoint = "/endpoint";
      const body = { data: "JSON body here" };

      await subject.post(endpoint, body);

      httpClient.verify(h => h.post(ApiService.root + endpoint, It.isAny(), It.isAny()), Times.once());
      expectNothing();
    });

    it("calls httpClient post with the body provided", async () => {
      const endpoint = "/endpoint";
      const body = { data: "JSON body here" };

      await subject.post(endpoint, body);

      httpClient.verify(h => h.post(It.isAny(), body, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls httpClient post with the 'withCredenials' flag set to true", async () => {
      const endpoint = "/endpoint";
      const body = { data: "JSON body here" };

      await subject.post(endpoint, body);

      httpClient.verify(h => h.post(It.isAny(), It.isAny(), { withCredentials: true }), Times.once());
      expectNothing();
    });
  });

  describe("delete", () => {
    it("calls httpClient delete with the root + parameter endpoint", async () => {
      const endpoint = "/endpoint";

      await subject.delete(endpoint);

      httpClient.verify(h => h.delete(ApiService.root + endpoint, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls httpClient delete with the 'withCredenials' flag set to true", async () => {
      const endpoint = "/endpoint";

      await subject.delete(endpoint);

      httpClient.verify(h => h.delete(It.isAny(), { withCredentials: true }), Times.once());
      expectNothing();
    });
  });

  describe("patch", () => {
    it("calls httpClient patch with the root + parameter endpoint", async () => {
      const endpoint = "/endpoint";
      const body = { data: "JSON body here" };

      await subject.patch(endpoint, body);

      httpClient.verify(h => h.patch(ApiService.root + endpoint, It.isAny(), It.isAny()), Times.once());
      expectNothing();
    });

    it("calls httpClient patch with the body provided", async () => {
      const endpoint = "/endpoint";
      const body = { data: "JSON body here" };

      await subject.patch(endpoint, body);

      httpClient.verify(h => h.patch(It.isAny(), body, It.isAny()), Times.once());
      expectNothing();
    });

    it("calls httpClient patch with the 'withCredenials' flag set to true", async () => {
      const endpoint = "/endpoint";
      const body = { data: "JSON body here" };

      await subject.patch(endpoint, body);

      httpClient.verify(h => h.patch(It.isAny(), It.isAny(), { withCredentials: true }), Times.once());
      expectNothing();
    });
  });
});
