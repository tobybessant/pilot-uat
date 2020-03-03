import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { BAD_REQUEST } from "http-status-codes";
import { IApiResponse } from "../../models/response/apiresponse";

export function checkBodyDoesMatch(model: ObjectSchema) {
  return function(req: Request, res: Response, next: NextFunction) {
    const check = model.validate(req.body);

    const { error, value } = check;
    if(error) {
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