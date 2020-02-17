import { createConnection, Repository, Connection } from "typeorm";
import { User } from "./entity/user";
import { connect } from 'http2';
import { Logger } from '@overnightjs/logger';

export class MSSQLDatabase {

  public async openConnection(): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      try {
        const connection = createConnection({
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
  
        Logger.Info("Database connection established...")
        resolve(connection);
      } catch(err) {
        reject(err);
      }
    })
  }
}