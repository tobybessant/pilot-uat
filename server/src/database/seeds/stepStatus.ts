import "reflect-metadata";
import { DatabaseSeeder } from "./databaseSeeder";
import { TABLE_NAME, StepStatus, StepStatusDbo } from "../entities/stepStatusDbo";

const seeder: DatabaseSeeder = new DatabaseSeeder();

const records: Partial<StepStatusDbo>[] = [
  { label: StepStatus.NOT_STARTED },
  { label: StepStatus.PASSED },
  { label: StepStatus.FAILED }
];

// tslint:disable-next-line: no-unused-expression
(async () => {
  try {
    await seeder.connect();
    await seeder.seedTable(TABLE_NAME, records);
  } finally {
    process.exit(0);
  }
})();
