import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "http-status-codes";

export function catchMalformedJson(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(BAD_REQUEST);
    res.json({ errors: ["Malformed JSON in request body"] });
    return;
  }

  next();
}