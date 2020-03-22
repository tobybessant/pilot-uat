import{ Validator } from "joiful";
import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "http-status-codes";
import { IApiResponse } from "../../../dto/response/common/apiResponse";
import { Constructor } from "joiful/core";

export class BodyMatches {
  constructor(private jf: Validator) { }

  public schema<T extends Constructor<any>>(model: T) {
    const jfScoped = this.jf;
    return function(req: Request, res: Response, next: NextFunction) {
      try {
        const check = jfScoped.validateAsClass(req.body, model);

        const { error, value } = check;
        if (error) {
          const errors: string[] = [];
          error.details.forEach(err => errors.push(err.message));

          res.status(BAD_REQUEST);
          res.json({
            errors
          } as IApiResponse<void>);
          return;
        }

        next();
      } catch (error) {
        res.status(BAD_REQUEST);
          res.json({
            errors: [
              "Malformed JSON request body"
            ]
          } as IApiResponse<void>);
      }
    }
  }
}