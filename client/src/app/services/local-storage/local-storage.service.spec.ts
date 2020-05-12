import { TestBed } from "@angular/core/testing";

import { LocalStorageService } from "./local-storage.service";
import { IMock, Mock, Times, It } from "typemoq";
import { expectNothing } from "test-utils/expect-nothing";

describe("LocalStorageService", () => {
  let localStorage: IMock<Storage>;

  let subject: LocalStorageService;

  beforeEach(() => {
    localStorage = Mock.ofType<Storage>();

    subject = new LocalStorageService(localStorage.object);
  });

  describe("get", () => {
    it("passes the provided key into the localStorage provider", () => {
      const key = "local_storage_key";
      const value = {};
      given_localStorage_getItem_returns_whenGiven(JSON.stringify(value), key);

      subject.get(key);


      localStorage.verify(l => l.getItem(key), Times.once());
      expectNothing();
    });
  });

  describe("set", () => {
    it("passes the provided key into the localStorage provider", () => {
      const key = "local_storage_key";
      const value = "I am the value!";

      subject.set(key, value);

      localStorage.verify(l => l.setItem(key, It.isAny()), Times.once());
      expectNothing();
    });

    it("passes the provided value into the localStorage provider (through JSON.stringify())", () => {
      const key = "local_storage_key";
      const value = "I am the value!";

      subject.set(key, value);

      localStorage.verify(l => l.setItem(It.isAny(), JSON.stringify(value)), Times.once());
      expectNothing();
    });
  });

  function given_localStorage_getItem_returns_whenGiven(returns: any, whenGiven: string) {
    localStorage
      .setup(l => l.getItem(whenGiven))
      .returns(() => returns);
  }
});
