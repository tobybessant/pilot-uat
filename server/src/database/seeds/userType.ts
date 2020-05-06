import "reflect-metadata";
import { DatabaseSeeder } from "./databaseSeeder";
import { TABLE_NAME, UserTypeDbo } from "../entities/userTypeDbo";

const seeder: DatabaseSeeder = new DatabaseSeeder();


const records: Partial<UserTypeDbo>[] = [
  { type: "Supplier" },
  { type: "Client" }
];

// tslint:disable-next-line: no-unused-expression
(async () => {
  try {
    await seeder.connect();
    await seeder.seedTable<UserTypeDbo>(TABLE_NAME, records);
  } finally {
    process.exit(0);
  }
})();
