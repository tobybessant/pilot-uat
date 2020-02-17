import { Request, Response } from 'express';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as passport from 'passport';
import { checkAuthentication } from '../middleware/checkAuthentication';

import { Repository } from 'typeorm';
import { User } from '../database/entity/user';

@Controller('auth')
export class Auth {

  constructor(
    private userRepository: Repository<User>
  ) {
  }

  @Post('createaccount')
  private createAccount(req: Request, res: Response) {
    // validate

    this.userRepository.create({ });

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