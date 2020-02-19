import { Request, Response, NextFunction } from "express";
import { Logger } from "@overnightjs/logger";

export const checkAuthentication = function(req: Request, res: Response, next: NextFunction) {
  if(req.isAuthenticated()) {
    Logger.Info("Authorized..." + JSON.stringify(req.user));
    return next();
  }

  Logger.Info("Authentication failed..." + JSON.stringify(req.user));
  res.redirect("/login");
}