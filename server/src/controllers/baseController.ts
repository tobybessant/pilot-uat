import { Response } from "express";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED, NOT_FOUND } from "http-status-codes";
import { IApiResponse } from "../dto/common/apiResponse";

export abstract class BaseController {

  protected OK<T>(res: Response, payload?: T): void {
    const response: Partial<IApiResponse<T>> = {
      errors: []
    };

    if(payload) {
      response.payload = payload;
    }

    res.status(OK);
    res.json(response);
  }

  protected created<T>(res: Response, payload?: T): void {
    const response: Partial<IApiResponse<T>> = {
      errors: []
    };

    if(payload) {
      response.payload = payload;
    }

    res.status(CREATED);
    res.json(response);
  }

  protected badRequest(res: Response, errors: string[]): void {
    const response: Partial<IApiResponse<void>> = {
      errors
    };

    res.status(BAD_REQUEST);
    res.json(response);
  }

  protected notFound(res: Response, errors: string[]): void {
    const response: Partial<IApiResponse<void>> = {
      errors
    };

    res.status(NOT_FOUND);
    res.json(response);
  }

  protected serverError(res: Response): void {
    const response: Partial<IApiResponse<void>> = {
      errors: [
        "Something went wrong..."
      ]
    };

    res.status(INTERNAL_SERVER_ERROR);
    res.json(response);
  }
}