import "reflect-metadata";
import { container } from "tsyringe";
import { MSSQLDatabase } from "..";

import { getConnection } from "typeorm";
import { Logger } from "@overnightjs/logger";

import { TABLE_NAME } from "../entities/testStatusDbo";
let database: MSSQLDatabase;

const records = [
  { status: "Not Tested" },
  { status: "Passed" },
  { status: "Failed" }
];

async function seed() {
  try {
    // remove records
    await getConnection().createQueryBuilder()
      .delete()
      .from(TABLE_NAME)
      .where("id IS NOT NULL")
      .execute();

    // seed records
    await getConnection().createQueryBuilder()
      .insert()
      .into(TABLE_NAME)
      .values(records)
      .execute();

  } catch (ex) {
    Logger.Err(`Error seeding ${TABLE_NAME}: `, ex.message);
  }
}

async function main() {
  Logger.Info(`Seeding ${TABLE_NAME}...`);
  database = container.resolve<MSSQLDatabase>(MSSQLDatabase);
  await database.openConnection();
  await seed();

  Logger.Info(`Sucessfully seeded ${TABLE_NAME} with: \n`);
  // tslint:disable-next-line: no-console
  console.log(records);

  process.exit(0);
}

main();