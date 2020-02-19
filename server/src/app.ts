import "reflect-metadata";
import UATPlatformServer from "./server";
import { MSSQLDatabase } from "./database";
import { container } from 'tsyringe';
import { User } from './database/entity/User';
import {RepositoryService} from "./database/repositories/repositoryservice";
import { Repository } from 'typeorm';

async function main() {
const database = new MSSQLDatabase();
const connection = await database.openConnection();

const server: UATPlatformServer = new UATPlatformServer(container);
server.start(8080);
}

main();