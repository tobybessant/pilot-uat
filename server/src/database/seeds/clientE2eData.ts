import "reflect-metadata";
import { DatabaseSeeder } from "./databaseSeeder";
import { Bcrypt } from "../../services/utils/bcryptHash";

const seeder: DatabaseSeeder = new DatabaseSeeder();

const databaseSeedData: Map<string, any[]> = new Map<string, any[]>();

const pwHash = new Bcrypt().hash("password1");
databaseSeedData.set("User", [
  {
    firstName: "userfn",
    lastName: "userln",
    email: "hey@me.com",
    passwordHash: pwHash,
    userType: { id: 3 }
  },
  {
    firstName: "userfn",
    lastName: "userln",
    email: "hey2@me.com",
    passwordHash: pwHash,
    userType: { id: 3 }
  }
]);

// tslint:disable-next-line: no-unused-expression
(async () => {
  try {
    await seeder.connect();
    await seeder.seed(databaseSeedData);
  } finally {
    process.exit(0);
  }
})();
