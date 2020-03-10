import { ConnectionOptions } from "typeorm";

export const DBConfig: ConnectionOptions = {
  type: "mssql",
  host: process.env.db_host || "localhost",
  port: Number(process.env.db_port) || 1433,
  username: process.env.db_user || "sa",
  password: process.env.db_password || "d3vel0pmentPassword",
  database: process.env.db_database || "UAT_APP_DEV",
  entities: [__dirname + "/entities/*.ts"],
  synchronize: false,
  logging: process.env.db_logging ? true : false
}