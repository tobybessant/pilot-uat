import { Request, Response } from "express";
import { Controller, Middleware, Post } from "@overnightjs/core";
import { Validator } from "joiful";
import { injectable } from "tsyringe";
import { UserDbo } from "../database/entities/userDbo";
import { UserTypeDbo } from "../database/entities/userTypeDbo";
import { ICreateUserRequest } from "../dto/request/common/createUser";
import { IUserResponse } from "../dto/response/common/user";
import { CaseRepository } from "../repositories/caseRepository";
import { OrganisationRepository } from "../repositories/organisationRepository";
import { ProjectRepository } from "../repositories/projectRepository";
import StepRepository from "../repositories/stepRepository";
import { TestSuiteRepository } from "../repositories/suiteRepository";
import { UserRepository } from "../repositories/userRepository";
import { UserTypeRepository } from "../repositories/userTypeRepository";
import { BodyMatches } from "../services/middleware/joi/bodyMatches";
import { CreateUser } from "../services/middleware/joi/schemas/createUser";
import { Bcrypt } from "../services/utils/bcryptHash";
import { BaseController } from "./baseController";
import { BASE_ENDPOINT } from "./BASE_ENDPOINT";
import { IAccountCredentials, IDemoAccounts } from "../dto/response/common/demoAccount";

@injectable()
@Controller(`${BASE_ENDPOINT}/demoaccount`)
export class DemoAccountController extends BaseController {

  constructor(
    private userRepository: UserRepository,
    private userTypeRepository: UserTypeRepository,
    private projectRepository: ProjectRepository,
    private testSuiteRepository: TestSuiteRepository,
    private testCaseRepository: CaseRepository,
    private stepRepository: StepRepository,
    private organisationRepository: OrganisationRepository,
    private bcrypt: Bcrypt
  ) {
    super();
  }
  @Post("initialise")
  public async setupDemoAccount(req: Request, res: Response) {

    const [supplierUser, supplierCredentials] = await this.createUserAccount("John", "Last", "Supplier");
    const [clientUser, clientCredentials] = await this.createUserAccount("Rachel", "Pollock", "Client");

    const project = await this.projectRepository.addProject(supplierUser, "My Fav Project");
    await this.projectRepository.addUserToProject(clientUser.email, project.id.toString());

    // suites
    const suiteA = await this.testSuiteRepository.addTestSuite(project, "Suite A");
    const suiteB = await this.testSuiteRepository.addTestSuite(project, "Suite B");

    // test cases
    const caseA1 = await this.testCaseRepository.addCase(suiteA, "Case 1");
    const caseA2 = await this.testCaseRepository.addCase(suiteA, "Case 2");

    const caseB1 = await this.testCaseRepository.addCase(suiteB, "Case 1");
    const caseB2 = await this.testCaseRepository.addCase(suiteB, "Case 2");
    const caseB3 = await this.testCaseRepository.addCase(suiteB, "Case 3");
    const caseB4 = await this.testCaseRepository.addCase(suiteB, "Case 4");

    // steps
    const stepA1A = await this.stepRepository.addStepForCase("Click button", caseA1.id.toString());
    const stepA1B = await this.stepRepository.addStepForCase("funny step", caseA1.id.toString());
    const stepA1C = await this.stepRepository.addStepForCase("funny step", caseA1.id.toString());
    const stepA1D = await this.stepRepository.addStepForCase("funny step", caseA1.id.toString());

    const stepB1A = await this.stepRepository.addStepForCase("Click button", caseA2.id.toString());
    const stepB1B = await this.stepRepository.addStepForCase("funny step", caseA2.id.toString());
    const stepB1C = await this.stepRepository.addStepForCase("funny step", caseA2.id.toString());
    const stepB1D = await this.stepRepository.addStepForCase("funny step", caseA2.id.toString());

    this.created<IDemoAccounts>(res, { client: clientCredentials, supplier: supplierCredentials });
  }

  private async createUserAccount(firstName: string, lastName: string, accountType: string): Promise<[UserDbo, IAccountCredentials]> {
    // NOT SECURE. Used for demo-account creation only.
    const randomEmail = Math.floor(Math.random() * 99999);
    const randomPass = Math.floor(Math.random() * 99999);

    // Add organisation
    const newOrganisation = await this.organisationRepository.createOrganisation(`DemoOrg-${randomEmail}`);

    // Add user credentials
    const userType: UserTypeDbo | undefined = await this.userTypeRepository.getTypeByType(accountType);

    // Hash password
    const passwordPlaintext = `a1!uafg3-${randomPass}`;
    const passwordHash = this.bcrypt.hash(passwordPlaintext);
    const account = await this.userRepository.addUser({
      email: `demo-${accountType}-${randomEmail}@pilot-uat.com`,
      firstName,
      lastName,
      passwordHash,
      userType,
      organisations: [newOrganisation]
    });

    return [account, { firstName, email: account.email, password: passwordPlaintext }]
  }
}