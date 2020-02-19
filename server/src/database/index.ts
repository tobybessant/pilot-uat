import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { DBConfig } from "./dbconfig";
import { Logger } from "@overnightjs/logger";
import { injectable } from "tsyringe";

@injectable()
export class MSSQLDatabase {

  private connection: Connection | null = null;
  private sync: boolean = process.env.TYPEORM_SYNC === "true";

  public async openConnection(): Promise<void> {
      try {
        this.connection = await createConnection(DBConfig as ConnectionOptions);
        Logger.Info("Database connection established...");
      } catch(err) {
        Logger.Err(err);
      }
  }

  public getConnection(): Connection | null {
    return this.connection;
  }
}