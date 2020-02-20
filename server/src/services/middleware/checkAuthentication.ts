import { Request, Response, NextFunction } from "express";
import { UNAUTHORIZED } from "http-status-codes";

export const checkAuthentication = function(req: Request, res: Response, next: NextFunction) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.status(UNAUTHORIZED);
  res.redirect("/login");
}