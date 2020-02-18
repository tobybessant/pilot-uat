import "reflect-metadata";
import UATPlatformServer from "./server";
import { MSSQLDatabase } from "./database";
import {  injectable, Container } from "inversify";
import { AuthController } from './controllers';
import { Katana } from './katana';

const database = new MSSQLDatabase();
const connection = database.openConnection();

const container = new Container();
container.bind<AuthController>(AuthController).toSelf();
container.bind<Katana>(Katana).toSelf();

const server: UATPlatformServer = new UATPlatformServer(container);
server.start(8080);