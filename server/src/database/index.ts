import { createConnection, Repository, Connection } from "typeorm";
import { User } from "./entity/user";
import { connect } from 'http2';
import { Logger } from '@overnightjs/logger';

export class MSSQLDatabase {

  private connection: Connection | null = null;

  constructor() {
  }

  public async openConnection(): Promise<Connection> {
    return new Promise<Connection>(async (resolve, reject) => {
      try {
        const conn = await createConnection({
          type: "mssql",
          host: "localhost",
          port: 1433,
          username: "sa",
          password: "d3vel0pmentPassword",
          database: "UAT_APP_DEV",
          entities: [
            __dirname + "/entity/*.ts"
          ],
          synchronize: true,
          logging: false
        })
        this.connection = conn;
  
        Logger.Info("Database connection established...")
        resolve(conn);
      } catch(err) {
        reject(err);
      }
    })
  }

  public getConnection(): Connection | null {
    return this.connection;
  }
}