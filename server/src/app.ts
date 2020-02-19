import "reflect-metadata";
import UATPlatformServer from "./server";
import { MSSQLDatabase } from "./database";
import { container } from "tsyringe";

async function main() {
  const database = new MSSQLDatabase();
  await database.openConnection();

  const server: UATPlatformServer = new UATPlatformServer(container);
  server.start(8080);
  }

main();