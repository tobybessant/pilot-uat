import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { DBConfig } from "./dbconfig";
import { Logger } from "@overnightjs/logger";
import { singleton } from "tsyringe";

@singleton()
export class MSSQLDatabase {

  private connection!: Connection;

  public async openConnection(): Promise<void> {
      try {
        this.connection = await createConnection(DBConfig);
        Logger.Info("Database connection established...");
      } catch(err) {
        throw new Error(err);
      }
  }

  public getConnection(): Connection {
    return this.connection;
  }
}