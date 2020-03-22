import { IMock, Mock, It, Times } from "typemoq";
import { Request, Response, NextFunction } from "express";
import { PermittedAccountTypes } from "../../../src/services/middleware/permittedAccountTypes";
import { UNAUTHORIZED } from "http-status-codes";

suite("PermittedAccountTypes", () => {

  let req: IMock<Request>;
  let res: IMock<Response>;
  let nextFunction: IMock<NextFunction>;

  suiteSetup(() => {
    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();
    nextFunction = Mock.ofType<NextFunction>();
  });

  teardown(() => {
    req.reset();
    res.reset();
    nextFunction.reset();
  });

  suite("Single type is permitted", () => {
    test("'next()' function is called", () => {
      given_Request_user_type_is("Supplier");

      const middleware = PermittedAccountTypes.are(["Supplier"]);
      middleware(req.object, res.object, nextFunction.object);

      nextFunction.verify(next => next(), Times.once());
    });
  });

  suite("Multiple types are permitted", () => {
    test("'next()' function is called", () => {
      given_Request_user_type_is("Supplier");

      const middleware = PermittedAccountTypes.are(["Supplier", "Client"]);
      middleware(req.object, res.object, nextFunction.object);

      nextFunction.verify(next => next(), Times.once());
    });
  });

  suite("Type is not permitted", () => {
    test("Response code is 401 (unauthorized)", () => {
      given_Request_user_type_is("Supplier");

      const middleware = PermittedAccountTypes.are(["Client"]);
      middleware(req.object, res.object, nextFunction.object);

      res.verify(r => r.status(UNAUTHORIZED), Times.once());
    });

    test("'next()' function is not called", () => {
      given_Request_user_type_is("Supplier");

      const middleware = PermittedAccountTypes.are(["Client"]);
      middleware(req.object, res.object, nextFunction.object);

      nextFunction.verify(next => next(), Times.never());
    });
  });

  function given_Request_user_type_is(type: string) {
    const userToken = { type, email: "xyz" };

    req
    .setup(r => r.user)
    // tslint:disable-next-line: no-unused-expression
    .returns(() => userToken);
  }
});