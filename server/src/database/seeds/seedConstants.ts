import { DatabaseSeeder } from "./databaseSeeder";
import { TABLE_NAME as USERTYPE_TABLE_NAME } from "../entities/userTypeDbo";
import {
  StepStatus,
  TABLE_NAME as STEPSTATUS_TABLE_NAME,
} from "../entities/stepStatusDbo";

const seeder: DatabaseSeeder = new DatabaseSeeder();
const databaseSeedData: Map<string, any[]> = new Map<string, any[]>();

databaseSeedData.set(USERTYPE_TABLE_NAME, [
  { type: "Supplier" },
  { type: "Client" },
]);

databaseSeedData.set(STEPSTATUS_TABLE_NAME, [
  { label: StepStatus.NOT_STARTED },
  { label: StepStatus.PASSED },
  { label: StepStatus.FAILED },
]);

export async function seedApplicationConstants() {
  try {
    await seeder.seed(databaseSeedData);
  } catch (e) {
    console.log(e);
  }
}
