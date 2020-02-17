import { Request, Response, NextFunction } from "express";
import * as passport from "passport";

export const checkAuthentication = function(req: Request, res: Response, next: NextFunction) {
  if(req.isAuthenticated()) {
    console.log("Authorized..." + JSON.stringify(req.user));
    return next();
  }
  res.redirect("/login");
}