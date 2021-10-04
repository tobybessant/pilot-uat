// tslint:disable: max-classes-per-file
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { mssqlDbConfig, mySqlDbConfig, sqlJsDbConfig } from "./dbconfig";
import { Logger } from "@overnightjs/logger";
import { singleton } from "tsyringe";

export interface IDatabase {
  openConnection(configOverwrite?: ConnectionOptions): Promise<void>;
  getConnection(): Connection;
}

export class MSSQLDatabase implements IDatabase {
  private connection!: Connection;

  public async openConnection(
    configOverwrite?: ConnectionOptions
  ): Promise<void> {
    try {
      this.connection = await createConnection(mssqlDbConfig);
      Logger.Info("MSSQL Database connection established...");
    } catch (err) {
      throw new Error(err);
    }
  }

  public getConnection(): Connection {
    return this.connection;
  }
}

export class SQLJSDatabase implements IDatabase {
  private connection!: Connection;

  public async openConnection(
    configOverwrite?: ConnectionOptions
  ): Promise<void> {
    try {
      this.connection = await createConnection(sqlJsDbConfig);
      Logger.Info("SQLJS Database connection established...");
    } catch (err) {
      throw new Error(err);
    }
  }

  public getConnection(): Connection {
    return this.connection;
  }
}

export class MySQLDatabase implements IDatabase {
  private connection!: Connection;

  public async openConnection(
    configOverwrite?: ConnectionOptions
  ): Promise<void> {
    try {
      this.connection = await createConnection(mySqlDbConfig);
      Logger.Info("MySQL Database connection established...");
    } catch (err) {
      throw new Error(err);
    }
  }

  public getConnection(): Connection {
    return this.connection;
  }
}

// Hack to get around some container issues. Whichever implementation this class extends will be used.
@singleton()
export class Database extends MySQLDatabase {}
