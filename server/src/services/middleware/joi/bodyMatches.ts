import { Request, Response, NextFunction } from "express";
import { ObjectSchema, ValidationResult } from "joi";
import { BAD_REQUEST } from "http-status-codes";
import { IApiResponse } from "../../../models/response/apiResponse";

export class BodyMatches {
  public static schema(model: ObjectSchema) {
    return function(req: Request, res: Response, next: NextFunction) {
      const check: ValidationResult<any> = model.validate(req.body);

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
    }
  }
}