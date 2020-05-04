import "reflect-metadata";
import * as dotenv from "dotenv";
import UATPlatformServer from "./server";
import { MSSQLDatabase } from "./database";
import { container } from "tsyringe";

dotenv.config();

async function main() {

  const database = container.resolve<MSSQLDatabase>(MSSQLDatabase);
  await database.openConnection();

  const server: UATPlatformServer = new UATPlatformServer(container);
  server.start(8080);
}

main();