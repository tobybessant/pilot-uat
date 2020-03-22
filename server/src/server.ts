import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as controllers from "./controllers";
import * as session from "express-session";
import * as cors from "cors";

import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { DependencyContainer } from "tsyringe"

import { Passport } from "./services/passport/passport";

class UATPlatformServer extends Server {

  private readonly SERVER_STARTED = "Server started on port: ";
  private readonly COOKIE_EXPIRY_DAYS = 7;
  private readonly COOKIE_EXPIRY_DURATION = (1000 * 60 * 60 * 24) * this.COOKIE_EXPIRY_DAYS;

  constructor(container: DependencyContainer) {
    super(true);

    // configure express
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(cors({
      credentials: true,
      origin: "http://localhost:4200"
    }));

    this.app.use(session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: this.COOKIE_EXPIRY_DURATION
      }
    }));

    // configure passport
    container.resolve<Passport>(Passport).initialise(this.app);

    // load controllers
    this.setupControllers(container);
  }

  private setupControllers(container: DependencyContainer): void {
    Logger.Info("Loading controllers...");

    const ctlrInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        const controller = (controllers as any)[name];
        ctlrInstances.push(container.resolve(controller));
      }
    }
    super.addControllers(ctlrInstances);
  }

  public start(port: number): void {
    this.app.get("*", (req, res) => {
      res.send(this.SERVER_STARTED + port);
    });

    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_STARTED + port);
    });
  }
}

export default UATPlatformServer;
