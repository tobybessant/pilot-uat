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

databaseSeedData.set(USER_TABLE_NAME, [
  {
    id: "abc-def1",
    firstName: "John",
    lastName: "Demo",
    email: "john.demo@pilot-uat.com",
    passwordHash: pwHash,
    userType: { id: "1" },
  },
  {
    id: "abc-def2",
    firstName: "Harold",
    lastName: "Demo",
    email: "harold.demo@pilot-uat.com",
    passwordHash: pwHash,
    userType: { id: "2" },
  },
]);

databaseSeedData.set(ORGANISATION_TABLE_NAME, [
  {
    id: 1,
    organisationName: "JohnDemoCo",
    users: [{ id: "abc-def1" }],
  },
  {
    organisationName: "HaroldDemoCo",
    users: [{ id: "abc-def2" }],
  },
]);

databaseSeedData.set(PRJOECT_TABLE_NAME, [
  {
    organisation: { id: 1 },
    suites: [],
    id: 1000976,
    title: "A Test Project",
    users: [{ id: "abc-def1" }, { id: "abc-def2" }],
  },
]);

databaseSeedData.set(USER_PROJECT_ROLE_TABLE_NAME, [
  {
    user: { id: "abc-def1" },
    project: { id: 1000976 },
  },
  {
    user: { id: "abc-def2" },
    project: { id: 1000976 },
  },
]);

export async function seedDemoData() {
  try {
    await seeder.seed(databaseSeedData);
  } catch (e) {
    console.log(e);
  }
}
