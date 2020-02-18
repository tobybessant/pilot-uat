import * as bodyParser from 'body-parser';
import * as cookieParser from "cookie-parser";
import * as controllers from './controllers';
import * as session from "express-session";

import * as passport from 'passport';
import * as strategies from "./services/strategies";

import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import {  Container } from "inversify";

import * as data from "../user";
import { AuthController } from './controllers';

class UATPlatformServer extends Server {

  private readonly SERVER_STARTED = 'Server started on port: ';
  private readonly COOKIE_EXPIRY_DAYS = 7;
  private readonly COOKIE_EXPIRY_DURATION = (1000 * 60 * 60 * 24) * this.COOKIE_EXPIRY_DAYS;

  constructor(container: Container) {
    super(true);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: this.COOKIE_EXPIRY_DURATION
      }
    }));

    this.app.use(passport.initialize())
    this.app.use(passport.session())

    this.setupAuthStrategies();
    this.setupControllers(container);
  }

  private setupControllers(container: Container): void {
    Logger.Info("Loading controllers...")

    /*
    const ctlrInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        const controller = (controllers as any)[name];
        ctlrInstances.push(new controller());
      }
    }
    super.addControllers(ctlrInstances);
    */
   const authController = container.get<AuthController>(AuthController);
   super.addControllers([authController]);
    
  }

  private setupAuthStrategies(): void {
    Logger.Info("Loading auth strategies...")
    
    passport.serializeUser(function(user: any, done) {
      done(null, user.email);
    });
    
    passport.deserializeUser(function(email: String, done) {
      const user = data.users.find((usr: any) => usr.email === email);
      if (user) done(null, user);
    });

    for (const strategyName in strategies) {
      if (strategies.hasOwnProperty(strategyName)) {
        const strategy = (strategies as any)[strategyName];
        strategy.init(passport);
      }
    }
  }

  public start(port: number): void {
    this.app.get('*', (req, res) => {
      res.send(this.SERVER_STARTED + port);
    });

    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_STARTED + port);
    });
  }
}

export default UATPlatformServer;