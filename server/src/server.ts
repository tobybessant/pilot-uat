import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as controllers from "./controllers";
import * as session from "express-session";
import * as cors from "cors";
import path = require("path");

import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { DependencyContainer } from "tsyringe";

import { Passport } from "./services/passport/passport";
import { catchMalformedJson } from "./services/middleware/catchMalformedJson";
import express = require("express");

// tslint:disable-next-line: no-var-requires
const MongoDbStore = require("connect-mongodb-session")(session);

class UATPlatformServer extends Server {

  private readonly SERVER_STARTED = "Server started on port: ";
  private readonly COOKIE_EXPIRY_DAYS = 7;
  private readonly COOKIE_EXPIRY_DURATION = (1000 * 60 * 60 * 24) * this.COOKIE_EXPIRY_DAYS;
  constructor(container: DependencyContainer) {
    super(true);

    // configure express
    this.app.use(bodyParser.json());
    this.app.use(catchMalformedJson);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use("/", express.static(path.resolve(__dirname, "public")));

    this.app.use(cors({
      credentials: true,
      origin: process.env.CLIENT_URL || "http://localhost:4200"
    }));

    this.app.use(session({
      secret: process.env.SESSION_SECRET || "i am secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: this.COOKIE_EXPIRY_DURATION,
        secure: process.env.NODE_ENV === "Production"
      },
      store:
          process.env.NODE_ENV === "Production"
            ? new MongoDbStore({
                uri: process.env.MONGO_CONNECTION_STR,
                collection: process.env.MONGO_COLLECTION_NAME,
              })
            : new session.MemoryStore()
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
    this.app.get("/api/v1/licenses", (req, res) => {
      res.sendFile(path.resolve(__dirname + "/assets/3rd-party-licenses.txt"));
    });

    this.app.get("*.*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "public", "index.html"));
    });

    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_STARTED + port);
    });
  }
}

export default UATPlatformServer;
