import { Request, Response } from 'express';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as passport from 'passport';
import { checkAuthentication } from '../middleware/checkAuthentication';

@Controller('auth')
export class Auth {

  @Post('login')
  @Middleware(passport.authenticate("local"))
  private login(req: Request, res: Response) {
    Logger.Info("Authenticated local");
    res.status(200).json({
      message: req.user
    });
  }

  @Get('logout')
  @Middleware(checkAuthentication)
  private logout(req: Request, res: Response) {
    Logger.Info("Logging out");
    req.logOut();

    res.status(200).json({
      message: "Logged out"
    });
  }
}