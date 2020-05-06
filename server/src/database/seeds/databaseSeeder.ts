import "reflect-metadata";

import * as dotenv from "dotenv";
dotenv.config();

import { container } from "tsyringe";
import { MSSQLDatabase } from "..";
import { ConnectionOptions } from "typeorm";
import { Logger } from "@overnightjs/logger";

const config: ConnectionOptions = {
  type: "mssql",
  host: process.env.DB_HOST,
  port: 1433,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    __dirname + "/entities/*.ts",
    __dirname + "/entities/*.js" // get dist models for when project is built
  ],
  synchronize: true,
  options: {
    encrypt: true
  },
  logging: process.env.db_logging ? true : false
};

export class DatabaseSeeder {

  private db: MSSQLDatabase;

  constructor() {
    this.db = container.resolve<MSSQLDatabase>(MSSQLDatabase);
  }

  public async connect(wipeExistingData: boolean = false): Promise<void> {
    await this.db.openConnection(config);
    await this.db.getConnection().synchronize(wipeExistingData);
  }

  public async closeConnection(): Promise<void> {
    await this.db.getConnection().close();
  }

  public async seed(data: Map<string, any[]>): Promise<void> {
    Logger.Info("--\n");
    for (const table of data.keys()) {
      await this.seedTable<any>(table, data.get(table) || []);
    }
  }

  public async seedTable<T>(table: string, records: Partial<T>[]): Promise<void> {
    Logger.Info(`Seeding ${table}...`);
    try {
      // remove records
      await this.db.getConnection().createQueryBuilder()
        .delete()
        .from(table)
        .where("id IS NOT NULL")
        .execute();

      // seed records
      await this.db.getConnection().createQueryBuilder()
        .insert()
        .into(table)
        .values(records)
        .execute();

      Logger.Info(`Sucessfully seeded ${table}`);
    } catch (ex) {
      Logger.Err(`Error seeding ${table}: `);
      console.log(ex);
    }
  }
}