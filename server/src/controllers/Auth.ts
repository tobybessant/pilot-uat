import { Request, Response } from 'express';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as passport from 'passport';
import { checkAuthentication } from '../middleware/checkAuthentication';

import { Repository } from 'typeorm';
import { User } from '../database/entity/user';
import { Katana } from '../katana';
import { injectable, inject } from 'inversify';

@injectable()
@Controller('auth')
export class AuthController {

  private k: Katana;

  constructor(
    private katana: Katana
  ) {
    this.k = katana;
  }

  @Post('createaccount')
  private createAccount(req: Request, res: Response) {
    // validate

    // this.userRepository.create({ });
    console.log(this.k.hit());
    console.log("hellow");
    res.status(200).json({
      message: req.user
    });
  }

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