import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import * as typeorm from "typeorm";

import { AuthController } from "../src/controllers/auth";
import { RepositoryService } from "../src/database/repositories/repositoryservice";
import { Repository } from "typeorm";
import { User } from "../src/database/entity/User";
import { MSSQLDatabase } from "../src/database";
import { rejects } from "assert";
import { SlowBuffer } from "buffer";

suite("Auth Controller", () => {
  let connection: TypeMoq.IMock<typeorm.Connection>;
  let database: TypeMoq.IMock<MSSQLDatabase>;
  let userRepository: TypeMoq.IMock<Repository<User>>;
  let repositoryService: TypeMoq.IMock<RepositoryService>;
  let subjAuthController: AuthController;
  let rS: RepositoryService;

  suiteSetup(async () => {
    connection = TypeMoq.Mock.ofType<typeorm.Connection>();
    database = TypeMoq.Mock.ofType<MSSQLDatabase>(MSSQLDatabase);
    userRepository = TypeMoq.Mock.ofType<Repository<User>>();

    setupDependencies();

    // repositoryService = TypeMoq.Mock.ofType<RepositoryService>(RepositoryService, undefined, true, [database.object]);
    rS = new RepositoryService(database.object);
    subjAuthController = new AuthController(rS);
  });

  teardown(() => {
    connection.reset();
    userRepository.reset();
    // repositoryService.reset();
  });

  test("testing", async () => {
    // const test = database.object.getConnection().getRepository<User>(User);
    // console.log(await test.findOne());
    console.log(await rS.getRepositoryFor<User>(User).findOne());
  });

  // -- UTILITY / SETUP FUNCTIONS
  function setupDependencies() {

    userRepository
      .setup(u => u.findOne(TypeMoq.It.isAny()))
      .returns(async () => new Promise<User>((resolve, reject) => {
        resolve({ email: "Test" } as User);
      }));

    connection
      .setup(c => c.getRepository<User>(User))
      .returns(() => userRepository.object)

    database
      .setup(d => d.getConnection())
      .returns(() => connection.object);

  }

  function given_repositoryService_getRepositoryFor_returns_whenGiven(returns: Repository<User>, whenGiven: string) {

    repositoryService
      .setup(r => r.getRepositoryFor(whenGiven))
      .returns(() => returns);
  }
});


