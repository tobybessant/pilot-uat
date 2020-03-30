import { Response } from "express";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED, NOT_FOUND } from "http-status-codes";
import { IApiResponse } from "../dto/response/common/apiResponse";
import { Logger } from "@overnightjs/logger";
import { ApiError } from "../services/apiError";

export abstract class BaseController {

  public static readonly INTERNAL_SERVER_ERROR_MESSAGE: string = "Something went wrong...";
  protected clientUrl = process.env.CLIENT_URL || "http://localhost:4200";

  protected OK<T>(res: Response, payload?: T): void {
    const response: Partial<IApiResponse<T>> = {
      errors: []
    };

    if (payload) {
      response.payload = payload;
    }

    res.status(OK);
    res.json(response);
  }

  protected created<T>(res: Response, payload?: T): void {
    const response: Partial<IApiResponse<T>> = {
      errors: []
    };

    if (payload) {
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

  protected serverError(res: Response, error: Error): void {
    Logger.Err("[SERVER_ERROR] " + error.message);

    if (error instanceof ApiError) {
      return this.errorResponse(res, error.statusCode, [error.message]);
    }

    const response: Partial<IApiResponse<void>> = {
      errors: [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]
    };

    res.status(INTERNAL_SERVER_ERROR);
    res.json(response);
  }

  protected errorResponse(res: Response, statusCode: number, errors: string[], shouldRedirect?: boolean): void {
    const response: Partial<IApiResponse<void>> = {
      errors,
    };

    res.status(statusCode);
    if (shouldRedirect) {
      res.redirect(`${this.clientUrl}/error?m=${JSON.stringify(errors)}`);
      return;
    }

    res.json(response);
  }
}