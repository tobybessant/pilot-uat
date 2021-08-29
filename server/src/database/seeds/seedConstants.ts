import { Bcrypt } from "../../services/utils/bcryptHash";
import { DatabaseSeeder } from "./databaseSeeder";
import { TABLE_NAME as PRJOECT_TABLE_NAME } from "../entities/projectDbo";
import { TABLE_NAME as USER_TABLE_NAME } from "../entities/userDbo";
import { TABLE_NAME as USERTYPE_TABLE_NAME } from "../entities/userTypeDbo";
import { TABLE_NAME as ORGANISATION_TABLE_NAME } from "../entities/organisationDbo";
import { TABLE_NAME as USER_PROJECT_ROLE_TABLE_NAME } from "../entities/userProjectRoleDbo";
import {
  StepStatus,
  TABLE_NAME as STEPSTATUS_TABLE_NAME,
} from "../entities/stepStatusDbo";

const seeder: DatabaseSeeder = new DatabaseSeeder();
const databaseSeedData: Map<string, any[]> = new Map<string, any[]>();

const pwHash = new Bcrypt().hash("password1");

databaseSeedData.set(USERTYPE_TABLE_NAME, [
  { type: "Supplier" },
  { type: "Client" },
]);

databaseSeedData.set(STEPSTATUS_TABLE_NAME, [
  { label: StepStatus.NOT_STARTED },
  { label: StepStatus.PASSED },
  { label: StepStatus.FAILED },
]);

export async function seedDemoData() {
  try {
    await seeder.seed(databaseSeedData);
  } catch (e) {
    console.log(e);
  }
}
