import { ConnectionOptions } from "typeorm";

export const mssqlDbConfig: ConnectionOptions = {
  type: "mssql",
  host: process.env.DB_HOST,
  port: 1433,
  username: process.env.MSSQL_DB_USER,
  password: process.env.MSSQL_DB_PASSWORD,
  database: process.env.MSSQL_DB_DATABASE,
  entities: [
    __dirname + "/entities/*.ts",
    __dirname + "/entities/*.js", // get dist models for when project is built
  ],
  synchronize: true,
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

export const mySqlDbConfig: ConnectionOptions = {
  type: "mysql",
  host: process.env.MYSQL_DB_HOST,
  port: 3306,
  username: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  entities: [
    __dirname + "/entities/*.ts",
    __dirname + "/entities/*.js", // get dist models for when project is built
  ],
  synchronize: false,
};
