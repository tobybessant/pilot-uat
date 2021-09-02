import { ConnectionOptions } from "typeorm";

export const mssqlDbConfig: ConnectionOptions = {
  type: "mssql",
  host: process.env.DB_HOST,
  port: 1433,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    __dirname + "/entities/*.ts",
    __dirname + "/entities/*.js", // get dist models for when project is built
  ],
  synchronize: false,
  options: {
    encrypt: true,
  },
  logging: process.env.db_logging ? true : false,
};

export const sqlJsDbConfig: ConnectionOptions = {
  type: "sqljs",
  entities: [
    __dirname + "/entities/*.ts",
    __dirname + "/entities/*.js", // get dist models for when project is built
  ],
  synchronize: true,
  logging: process.env.db_logging ? true : false,
};
