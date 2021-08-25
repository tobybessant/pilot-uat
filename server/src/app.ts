import "reflect-metadata";

import * as dotenv from "dotenv";
dotenv.config();

import UATPlatformServer from "./server";
import { Database } from "./database";
import { container } from "tsyringe";

async function main() {

  const database = container.resolve<Database>(Database);
  await database.openConnection();

  const server: UATPlatformServer = new UATPlatformServer(container);
  server.start(Number(process.env.PORT) || 8080);
}

main();