import { assert } from "chai";
import { IMock, Mock, It, Times } from "typemoq";
import { Request, Response, NextFunction } from "express";
import { ObjectSchema, ValidationResult, ValidationError } from "joi";
import { BodyMatches } from "../../../src/services/middleware/joi/bodyMatches";
import { BAD_REQUEST } from "http-status-codes";
import * as jf from "joiful";

suite("BodyMatches", () => {

  class ModelValidationSchema {
    @jf.string()
    title: string = "hello";
  }

  let model: IMock<ModelValidationSchema>;
  let req: IMock<Request>;
  let res: IMock<Response>;
  let nextFunction: IMock<NextFunction>;
  let jfValidator: IMock<jf.Validator>;

  setup(() => {
    req = Mock.ofType<Request>();
    res = Mock.ofType<Response>();
    nextFunction = Mock.ofType<NextFunction>();
    model = Mock.ofType<ModelValidationSchema>();
    jfValidator = Mock.ofType<jf.Validator>();
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
      };

      given_Request_body_is(body);
      given_model_validate_succeeds();

      const middleware = new BodyMatches(jfValidator.object).schema(ModelValidationSchema);
      middleware(req.object, res.object, nextFunction.object);

      assert.deepInclude(req.object.body, body);
    });

    test("'next()' method is called", () => {
      given_model_validate_succeeds();

      const middleware = new BodyMatches(jfValidator.object).schema(ModelValidationSchema);
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

      const middleware = new BodyMatches(jfValidator.object).schema(ModelValidationSchema);
      middleware(req.object, res.object, nextFunction.object);

      nextFunction.verify(next => next(), Times.never());
    });

    test("Response body contains errors thrown by joi", () => {
      const errors = [
        { message: "Error 1"},
        { message: "Error 3"}
      ];
      given_model_validate_fails_with(errors);

      const middleware = new BodyMatches(jfValidator.object).schema(ModelValidationSchema);
      middleware(req.object, res.object, nextFunction.object);

      res.verify(r => r.json({ errors: errors.map(err => err.message) }), Times.once());
    });

    test("Status code is 400", () => {
      const errors = [
        { message: "Error 1"},
        { message: "Error 3"}
      ];
      given_model_validate_fails_with(errors);

      const middleware = new BodyMatches(jfValidator.object).schema(ModelValidationSchema);
      middleware(req.object, res.object, nextFunction.object);

      res.verify(r => r.status(BAD_REQUEST), Times.once());
    });
  });

  function given_model_validate_succeeds() {
    jfValidator
      .setup(m => m.validateAsClass(It.isAny(), It.isAny()))
      .returns(() => ({} as ValidationResult<any>));
  }

  function given_model_validate_fails_with(errors: { message: string }[]) {
    const error = {
      details: [
        ...errors
      ]
    } as ValidationError;

    jfValidator
      .setup(m => m.validateAsClass(It.isAny(), It.isAny()))
      .returns(() => ({ error } as ValidationResult<any>));
  }

  function given_Request_body_is(value: any) {
    req
      .setup(r => r.body)
      .returns(() => value)
  }
});