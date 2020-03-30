import { Response } from "express";
import { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED, NOT_FOUND, SERVICE_UNAVAILABLE } from "http-status-codes";
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

  protected badRequest(res: Response, errors: string[], redirectToErrorPage?: boolean): void {
    const response: Partial<IApiResponse<void>> = {
      errors
    };

    this.errorResponse(res, BAD_REQUEST, response, redirectToErrorPage);
  }

  protected serviceUnavailable(res: Response, errors: string[], redirectToErrorPage?: boolean): void {
    const response: Partial<IApiResponse<void>> = {
      errors
    };

    this.errorResponse(res, SERVICE_UNAVAILABLE, response, redirectToErrorPage);
  }

  protected notFound(res: Response, errors: string[], redirectToErrorPage?: boolean): void {
    const response: Partial<IApiResponse<void>> = {
      errors
    };

    this.errorResponse(res, NOT_FOUND, response, redirectToErrorPage);
  }

  protected serverError(res: Response, error: Error, redirectToErrorPage?: boolean): void {
    Logger.Err("[SERVER_ERROR] " + error.message);

    if (error instanceof ApiError) {
      return this.errorResponse(res, error.statusCode, { errors: [error.message] }, error.redirectToErrorPage);
    }

    const response: Partial<IApiResponse<void>> = {
      errors: [BaseController.INTERNAL_SERVER_ERROR_MESSAGE]
    };

    this.errorResponse(res, INTERNAL_SERVER_ERROR, response, redirectToErrorPage);
  }

  protected errorResponse(res: Response, statusCode: number, response?: any, redirectToErrorPage?: boolean): void {

    res.status(statusCode);

    if (redirectToErrorPage) {
      let url = this.clientUrl;

      if (response?.errors) {
        url += `/error?m=${JSON.stringify(response.errors)}`;
      }

      return res.redirect(url);
    }

    res.json(response);
  }
}