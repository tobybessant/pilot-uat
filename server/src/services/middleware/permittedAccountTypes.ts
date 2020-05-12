import { Request, Response, NextFunction } from "express";
import { UNAUTHORIZED } from "http-status-codes";

export class PermittedAccountTypes {
  public static are(types: string[]) {
    return function (req: Request, res: Response, next: NextFunction) {
      const type = (req.user as any).type;

      if (!types.includes(type)) {
        res.status(UNAUTHORIZED);
        res.redirect("/");
        return;
      }

      next();
    };
  }
}
