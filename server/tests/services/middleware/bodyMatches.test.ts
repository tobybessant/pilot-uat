import { assert } from "chai";
import { IMock, Mock, It, Times } from "typemoq";
import { Request, Response, NextFunction } from "express";
import { ObjectSchema, ValidationResult, ValidationError } from "joi";
import { BodyMatches } from "../../../src/services/middleware/joi/bodyMatches";
import { BAD_REQUEST } from "http-status-codes";

suite("BodyMatches", () => {

  let model: IMock<ObjectSchema>;
  let req: IMock<Request>;
  let res: IMock<Response>;
  let nextFunction: IMock<NextFunction>;

  suiteSetup(() => {
    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();
    nextFunction = Mock.ofType<NextFunction>();
    model = Mock.ofType<ObjectSchema>();
  });

  teardown(() => {
    req.reset();
    res.reset();
    nextFunction.reset();
    model.reset();
  });

  suite("Validation succeeds", () => {

    test("Request body still has initial model data", () => {
      const body = {
        test: "data"
      }

      given_Request_body_is(body);
      given_model_validate_succeeds();

      const middleware = BodyMatches.modelSchema(model.object);
      middleware(req.object, res.object, nextFunction.object);

      assert.deepInclude(req.object.body, body);
    });

    test("'next()' method is called", () => {
      given_model_validate_succeeds();

      const middleware = BodyMatches.modelSchema(model.object);
      middleware(req.object, res.object, nextFunction.object);

      nextFunction.verify(next => next(), Times.once());
    });
  });

  suite("Validation fails", () => {
    test("'next()' method is not called", () => {
      const errors = [
        { message: "Error 1"},
        { message: "Error 3"}
      ];
      given_model_validate_fails_with(errors);

      const middleware = BodyMatches.modelSchema(model.object);
      middleware(req.object, res.object, nextFunction.object);

      nextFunction.verify(next => next(), Times.never());
    });

    test("Response body contains errors thrown by joi", () => {
      const errors = [
        { message: "Error 1"},
        { message: "Error 3"}
      ];
      given_model_validate_fails_with(errors);

      const middleware = BodyMatches.modelSchema(model.object);
      middleware(req.object, res.object, nextFunction.object);

      res.verify(r => r.json({ errors: errors.map(err => err.message) }), Times.once());
    });

    test("Status code is 400", () => {
      const errors = [
        { message: "Error 1"},
        { message: "Error 3"}
      ];
      given_model_validate_fails_with(errors);

      const middleware = BodyMatches.modelSchema(model.object);
      middleware(req.object, res.object, nextFunction.object);

      res.verify(r => r.status(BAD_REQUEST), Times.once());
    });
  });

  function given_model_validate_succeeds() {
    model
      .setup(m => m.validate(It.isAny()))
      .returns(() => ({} as ValidationResult<any>));
  }

  function given_model_validate_fails_with(errors: { message: string }[]) {
    const error = {
      details: [
        ...errors
      ]
    } as ValidationError;

    model
      .setup(m => m.validate(It.isAny()))
      .returns(() => ({ error } as ValidationResult<any>));
  }

  function given_Request_body_is(value: any) {
    req
      .setup(r => r.body)
      .returns(() => value)
  }
});