import "reflect-metadata";
import UATPlatformServer from "./Server";
import { MSSQLDatabase } from "./database";
import { Connection } from 'typeorm';

const database = new MSSQLDatabase();
const connection = database.openConnection();

const server: UATPlatformServer = new UATPlatformServer();
server.start(8080);