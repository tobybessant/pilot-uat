import { createConnection, Repository, Connection } from "typeorm";
import { User } from "./entity/user";
import { connect } from 'http2';
import { Logger } from '@overnightjs/logger';
import { injectable } from 'tsyringe';

@injectable()
export class MSSQLDatabase {

  private connection: Connection | null = null;
  private sync: boolean = process.env.TYPEORM_SYNC === "true";

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
          synchronize: this.sync,
          logging: false
        })
        this.connection = conn;
        const u = this.connection.getRepository(User).find({});
        console.log(JSON.stringify(u));

  
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